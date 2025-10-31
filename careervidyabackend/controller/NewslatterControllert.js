
import ApiError from "../utilities/ApiError.js";
import NewsletterLog from "../models/Admin/NewsletterLog.js";
import NewsletterSubscriber from "../models/Admin/NewsletterSubscriber.js";

export const addSubscriber = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(400, "Email required");
    }

    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber) {
      if (!subscriber.isActive) {
        // Reactivate instead of throwing error
        subscriber.isActive = true;
        subscriber.unsubscribedAt = null;
        await subscriber.save();
        return res
          .status(200)
          .json({ msg: "Resubscribed successfully", subscriber });
      } else {
        return res.status(200).json({ msg: "Already subscribed" });
      }
    }

    // If new email, create fresh subscriber
    subscriber = await NewsletterSubscriber.create({ email });
    res.status(201).json({ msg: "Subscribed successfully", subscriber });
  } catch (error) {
    next(error);
  }
};

export const unSubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { isActive: false, unsubscribedAt: new Date() },
      { new: true }
    );

    if (!subscriber) throw new ApiError(404, "Subscriber not found");

    res.status(200).json({ msg: "Unsubscribed successfully" });
  } catch (error) {
    next(error);
  }
};

export const listSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, activeOnly } = req.query;
    const filter = activeOnly ? { isActive: true } : {};

    const [subs, total] = await Promise.all([
      NewsletterSubscriber.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      NewsletterSubscriber.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      subscribers: subs,
    });
  } catch (error) {
    next(error);
  }
};

export const sendNewsLetter = async (req, res, next) => {
  try {
    const { subject, body } = req.body;
    if (!subject || !body) {
      throw new ApiError(400, "Subject and body required");
    }

    const subscribers = await NewsletterSubscriber.find({ isActive: true });
    const emails = subscribers.map((s) => s.email);

    const log = await NewsletterLog.create({
      subject,
      body,
      recipients: emails,
      status: "pending",
    });

    console.log("📧 Sending newsletter to", emails.length, "subscribers");

    log.status = "sent";
    log.sentAt = new Date();
    await log.save();

    res.status(200).json({ msg: "Newsletter sent", log });
  } catch (error) {
    next(error);
  }
};
