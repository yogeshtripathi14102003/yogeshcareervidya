import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import userModel from "../models/user/userModel.js";
import AuthModel from "../models/user/AuthModel.js";
import "dotenv/config";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userModel.findOne({ oauthId: profile.id });
        
        if (existingUser) {
          if (existingUser.role === "subadmin") return done(null, false); // Block subadmin OAuth
          return done(null, existingUser);
        }

        const newUser = await userModel.create({
          oauthId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value,
        });

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Optional if using sessions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});

export default passport;
