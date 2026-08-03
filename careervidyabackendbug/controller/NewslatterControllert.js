import ApiError from "../utilities/ApiError.js";
import { nanoid } from "nanoid";
import XLSX from "xlsx";
import NewsletterLog from "../models/Admin/NewsletterLog.js";
import NewsletterSubscriber from "../models/Admin/NewsletterSubscriber.js";
import NewsletterDelivery from "../models/Admin/NewsletterDelivery.js";
import { sendToEmail } from "../utilities/sendEmail.js";
import {
  getNewsletterConfirmTemplate,
  getNewsletterCampaignTemplate,
} from "../utilities/emailTemplates.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://careervidya.in";
const BACKEND_URL = process.env.BACKEND_PUBLIC_URL || "https://api.careervidya.in";
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const VERIFICATION_EXPIRY_HOURS = 48;

/* =====================================================
   SUBSCRIBE (double opt-in — sends a confirmation email
   instead of activating immediately)
===================================================== */
export const addSubscriber = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) throw new ApiError(400, "Email is required");
    if (!EMAIL_REGEX.test(email)) throw new ApiError(400, "Please enter a valid email address");

    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.isActive && subscriber.verified) {
        return res.status(200).json({ success: true, msg: "You're already subscribed!" });
      }
      // Resubscribing (previously unsubscribed) or never confirmed —
      // either way, re-send the confirmation.
      subscriber.isActive = true;
      subscriber.unsubscribedAt = null;
    } else {
      subscriber = new NewsletterSubscriber({ email });
    }

    subscriber.verificationToken = nanoid(32);
    subscriber.verificationExpires = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);
    await subscriber.save();

    const confirmUrl = `${BACKEND_URL}/api/v1/newsletter/confirm/${subscriber.verificationToken}`;

    // Fire-and-forget — don't make the subscriber wait on SMTP round-trip.
    sendToEmail({
      to: email,
      subject: "Confirm your CareerVidya newsletter subscription",
      html: getNewsletterConfirmTemplate(confirmUrl),
    }).catch((err) => console.error("Newsletter confirm email failed:", err.message));

    res.status(201).json({
      success: true,
      msg: "Almost done! Check your inbox to confirm your subscription.",
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   CONFIRM SUBSCRIPTION (double opt-in link)
===================================================== */
export const confirmSubscription = async (req, res) => {
  try {
    const { token } = req.params;
    const subscriber = await NewsletterSubscriber.findOne({ verificationToken: token });

    if (!subscriber || !subscriber.verificationExpires || subscriber.verificationExpires < new Date()) {
      return res.redirect(`${FRONTEND_URL}/newsletter/confirm?status=expired`);
    }

    subscriber.verified = true;
    subscriber.isActive = true;
    subscriber.verificationToken = undefined;
    subscriber.verificationExpires = undefined;
    await subscriber.save();

    res.redirect(`${FRONTEND_URL}/newsletter/confirm?status=success`);
  } catch (error) {
    console.error("confirmSubscription error:", error);
    res.redirect(`${FRONTEND_URL}/newsletter/confirm?status=error`);
  }
};

/* =====================================================
   UNSUBSCRIBE — by email (form) or by token (one-click email link)
===================================================== */
export const unSubscribe = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) throw new ApiError(400, "Email is required");

    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { isActive: false, unsubscribedAt: new Date() },
      { new: true }
    );

    if (!subscriber) throw new ApiError(404, "Subscriber not found");

    res.status(200).json({ success: true, msg: "Unsubscribed successfully" });
  } catch (error) {
    next(error);
  }
};

export const unsubscribeByToken = async (req, res) => {
  try {
    const { token } = req.params;
    await NewsletterSubscriber.findOneAndUpdate(
      { unsubscribeToken: token },
      { isActive: false, unsubscribedAt: new Date() }
    );
    res.redirect(`${FRONTEND_URL}/newsletter/unsubscribed`);
  } catch (error) {
    console.error("unsubscribeByToken error:", error);
    res.redirect(`${FRONTEND_URL}/newsletter/unsubscribed`);
  }
};

/* =====================================================
   ADMIN: LIST / SEARCH / FILTER SUBSCRIBERS
===================================================== */
export const listSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;

    const filter = {};
    if (search) filter.email = { $regex: search.trim(), $options: "i" };
    if (status === "active") filter.isActive = true;
    else if (status === "inactive") filter.isActive = false;
    else if (status === "unverified") filter.verified = false;

    const [subs, total] = await Promise.all([
      NewsletterSubscriber.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      NewsletterSubscriber.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      subscribers: subs,
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   ADMIN: EXPORT SUBSCRIBERS (Excel / CSV)
===================================================== */
export const exportSubscribers = async (req, res, next) => {
  try {
    const { status, format = "xlsx" } = req.query;
    const filter = {};
    if (status === "active") filter.isActive = true;
    else if (status === "inactive") filter.isActive = false;

    const subs = await NewsletterSubscriber.find(filter).sort({ createdAt: -1 }).lean();

    const rows = subs.map((s) => ({
      Email: s.email,
      Status: s.isActive ? "Active" : "Unsubscribed",
      Verified: s.verified ? "Yes" : "No",
      "Subscribed On": new Date(s.createdAt).toLocaleDateString("en-IN"),
      "Unsubscribed On": s.unsubscribedAt ? new Date(s.unsubscribedAt).toLocaleDateString("en-IN") : "",
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const filename = `newsletter-subscribers-${Date.now()}.${format === "csv" ? "csv" : "xlsx"}`;

    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      return res.send(XLSX.utils.sheet_to_csv(sheet));
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Subscribers");
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   ADMIN: DELETE SUBSCRIBER
===================================================== */
export const deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) throw new ApiError(404, "Subscriber not found");
    res.status(200).json({ success: true, msg: "Subscriber deleted" });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   ADMIN: CAMPAIGN HISTORY
===================================================== */
export const getNewsletterLogs = async (req, res, next) => {
  try {
    const logs = await NewsletterLog.find().sort({ createdAt: -1 }).lean();

    const withRates = logs.map((log) => ({
      ...log,
      openRate: log.successCount > 0 ? +((log.openCount / log.successCount) * 100).toFixed(1) : 0,
      clickRate: log.successCount > 0 ? +((log.clickCount / log.successCount) * 100).toFixed(1) : 0,
    }));

    res.status(200).json({ success: true, logs: withRates });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   ADMIN: PER-CAMPAIGN DELIVERY LOG (Success/Failed)
===================================================== */
export const getCampaignDeliveries = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const filter = { campaign: req.params.id };
    if (status) filter.status = status;

    const [deliveries, total] = await Promise.all([
      NewsletterDelivery.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select("email status error sentAt openedAt clickedAt"),
      NewsletterDelivery.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, deliveries, total });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   ADMIN: SEND NEWSLETTER
   Sends individually per subscriber (never all addresses in one "to"
   field — the old version did that, which leaks every subscriber's
   email to every other subscriber). Responds immediately; sending
   happens in the background so the admin's browser doesn't hang
   waiting on however many hundred SMTP round-trips.
===================================================== */
export const sendNewsLetter = async (req, res, next) => {
  try {
    const { subject, body } = req.body;
    if (!subject || !body) throw new ApiError(400, "Subject and body required");

    const subscribers = await NewsletterSubscriber.find({ isActive: true, verified: true });
    if (subscribers.length === 0) throw new ApiError(400, "No active, confirmed subscribers found");

    const campaign = await NewsletterLog.create({
      subject,
      body,
      totalRecipients: subscribers.length,
      status: "sending",
    });

    res.status(202).json({
      success: true,
      msg: `Sending to ${subscribers.length} subscriber${subscribers.length > 1 ? "s" : ""}…`,
      campaignId: campaign._id,
    });

    // ---- Background delivery (fire-and-forget past this point) ----
    deliverCampaign(campaign, body, subject, subscribers).catch((err) =>
      console.error("Newsletter campaign delivery failed:", err.message)
    );
  } catch (error) {
    next(error);
  }
};

const deliverCampaign = async (campaign, body, subject, subscribers) => {
  const BATCH_SIZE = 20; // gentle on Gmail SMTP's rate limits
  const BATCH_DELAY_MS = 2000;

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async (subscriber) => {
        const trackingToken = nanoid(24);
        const unsubscribeUrl = `${BACKEND_URL}/api/v1/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;
        const pixelUrl = `${BACKEND_URL}/api/v1/newsletter/track/open/${trackingToken}`;

        const delivery = await NewsletterDelivery.create({
          campaign: campaign._id,
          subscriber: subscriber._id,
          email: subscriber.email,
          trackingToken,
        });

        try {
          const trackedBody = wrapLinksForTracking(body, trackingToken);
          await sendToEmail({
            to: subscriber.email,
            subject,
            html: getNewsletterCampaignTemplate(trackedBody, unsubscribeUrl, pixelUrl),
          });
          delivery.status = "sent";
          delivery.sentAt = new Date();
          successCount += 1;
        } catch (err) {
          delivery.status = "failed";
          delivery.error = err.message;
          failedCount += 1;
        }
        await delivery.save();
      })
    );

    if (i + BATCH_SIZE < subscribers.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  campaign.successCount = successCount;
  campaign.failedCount = failedCount;
  campaign.status = failedCount === 0 ? "sent" : successCount > 0 ? "sent" : "failed";
  campaign.sentAt = new Date();
  await campaign.save();
};

/* =====================================================
   OPEN / CLICK TRACKING
===================================================== */
const TRANSPARENT_PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7",
  "base64"
);

// Rewrites every http(s) link in the campaign body to route through the
// click-tracking redirect first. Deliberately conservative: only touches
// `href="http...".` attributes, leaves every other tag/attribute in the
// admin's HTML untouched, so it can't mangle their formatting.
const wrapLinksForTracking = (html, trackingToken) => {
  return html.replace(
    /href=(["'])(https?:\/\/[^"']+)\1/gi,
    (_match, quote, url) =>
      `href=${quote}${BACKEND_URL}/api/v1/newsletter/track/click/${trackingToken}?url=${encodeURIComponent(url)}${quote}`
  );
};

export const trackOpen = async (req, res) => {
  try {
    const { token } = req.params;
    const delivery = await NewsletterDelivery.findOne({ trackingToken: token });

    if (delivery && !delivery.openedAt) {
      delivery.openedAt = new Date();
      await delivery.save();
      await NewsletterLog.updateOne({ _id: delivery.campaign }, { $inc: { openCount: 1 } });
    }
  } catch (error) {
    console.error("trackOpen error:", error.message);
  }

  res.set("Content-Type", "image/gif");
  res.send(TRANSPARENT_PIXEL);
};

export const trackClick = async (req, res) => {
  const rawUrl = req.query.url;
  const targetUrl = typeof rawUrl === "string" && /^https?:\/\//i.test(rawUrl) ? rawUrl : FRONTEND_URL;

  try {
    const { token } = req.params;
    const delivery = await NewsletterDelivery.findOne({ trackingToken: token });

    if (delivery && !delivery.clickedAt) {
      delivery.clickedAt = new Date();
      await delivery.save();
      await NewsletterLog.updateOne({ _id: delivery.campaign }, { $inc: { clickCount: 1 } });
    }
  } catch (error) {
    console.error("trackClick error:", error.message);
  }

  res.redirect(targetUrl);
};

/* =====================================================
   ADMIN: OVERALL NEWSLETTER ANALYTICS
===================================================== */
export const getNewsletterAnalytics = async (req, res, next) => {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [totalSubscribers, activeSubscribers, newThisMonth, campaigns] = await Promise.all([
      NewsletterSubscriber.countDocuments({}),
      NewsletterSubscriber.countDocuments({ isActive: true, verified: true }),
      NewsletterSubscriber.countDocuments({ createdAt: { $gte: monthStart } }),
      NewsletterLog.find({ status: "sent" }).select("successCount openCount clickCount").lean(),
    ]);

    const totalSent = campaigns.reduce((s, c) => s + (c.successCount || 0), 0);
    const totalOpens = campaigns.reduce((s, c) => s + (c.openCount || 0), 0);
    const totalClicks = campaigns.reduce((s, c) => s + (c.clickCount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalSubscribers,
        activeSubscribers,
        newThisMonth,
        campaignsSent: campaigns.length,
        avgOpenRate: totalSent > 0 ? +((totalOpens / totalSent) * 100).toFixed(1) : 0,
        avgClickRate: totalSent > 0 ? +((totalClicks / totalSent) * 100).toFixed(1) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
