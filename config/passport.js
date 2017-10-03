const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;

const User = require('../app/models/user');
const configAuth = require('./auth');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {

        process.nextTick(function () {
            User.findOne({'local.username': username}, function (err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    let newUser            = new User();

                    newUser.local.username    = username;
                    newUser.local.password    = newUser.generateHash(password);
                    newUser.data.userType     = 'user';
                    newUser.data.registerType = 'local';
                    const d = new Date();
                    const date = d.toLocaleDateString();
                    const t = new Date(d.getYear(), d.getMonth(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds());
                    const time = t.toTimeString();
                    newUser.data.createdAt    = date + ' ' + time;
                    newUser.data.deletedAt    = null;

                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {

        User.findOne({'local.username': username}, function (err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            return done(null, user);
        });

    }));

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'email', 'name', 'displayName', 'picture']
    }, function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({'data.oauthID': profile.id}, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    const newUser = new User();

                    newUser.data.oauthID      = profile.id;
                    newUser.data.firstName    = profile.name.givenName;
                    newUser.data.lastName     = profile.name.familyName;
                    newUser.data.email        = profile.emails[0].value;
                    newUser.data.image        = profile.photos[0].value;
                    newUser.data.userType     = 'user';
                    newUser.data.registerType = 'facebook';
                    const d = new Date();
                    const date = d.toLocaleDateString();
                    const t = new Date(d.getYear(), d.getMonth(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds());
                    const time = t.toTimeString();
                    newUser.data.createdAt    = date + ' ' + time;
                    newUser.data.deletedAt    = null;

                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use(new GithubStrategy({
        clientID: configAuth.githubAuth.clientID,
        clientSecret: configAuth.githubAuth.clientSecret,
        callbackURL: configAuth.githubAuth.callbackURL,
        profileFields: ['id', 'displayName']
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({'data.oauthID': profile.id}, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    const newUser = new User();

                    newUser.data.oauthID      = profile.id;
                    newUser.data.firstName    = profile.username;
                    newUser.data.image        = profile._json.avatar_url;
                    newUser.data.userType     = 'user';
                    newUser.data.registerType = 'github';
                    const d = new Date();
                    const date = d.toLocaleDateString();
                    const t = new Date(d.getYear(), d.getMonth(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds());
                    const time = t.toTimeString();
                    newUser.data.created      = date + ' ' + time;
                    newUser.data.deletedAt    = null;

                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("saving user ...");
                            done(null, newUser);
                        }
                    });
                }
            });
        });
    }));

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'email']
    }, function (request, accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({'data.oauthID': profile.id}, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    user = new User();

                    user.data.oauthID      = profile.id;
                    user.data.firstName    = profile.name.givenName;
                    user.data.lastName     = profile.name.familyName;
                    user.data.email        = profile.email;
                    user.data.image        = profile.photos[0].value;
                    user.data.userType     = 'user';
                    user.data.registerType = 'google';
                    const d = new Date();
                    const date = d.toLocaleDateString();
                    const t = new Date(d.getYear(), d.getMonth(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds());
                    const time = t.toTimeString();
                    user.data.created      = date + ' ' + time;
                    user.data.deletedAt    = null;

                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("saving user ...");
                            done(null, user);
                        }
                    });
                }
            });
        });
    }));

    passport.use(new InstagramStrategy({
        clientID: configAuth.instagram.clientID,
        clientSecret: configAuth.instagram.clientSecret,
        callbackURL: configAuth.instagram.callbackURL
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({'data.oauthID': profile.id}, function (err, user) {
                console.log(profile);
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    user = new User();

                    user.data.oauthID      = profile.id;
                    user.data.username     = profile.username;
                    user.data.firstName    = profile.displayName.split(' ')[0];
                    user.data.lastName     = profile.displayName.split(/[, ]+/).pop();
                    user.data.image        = profile._json.data.profile_picture;
                    user.data.userType     = 'user';
                    user.data.registerType = 'instagram';
                    const d = new Date();
                    const date = d.toLocaleDateString();
                    const t = new Date(d.getYear(), d.getMonth(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds());
                    const time = t.toTimeString();
                    user.data.created      = date + ' ' + time;
                    user.data.deletedAt    = null;

                    user.save(function (err) {
                        if (err) {
                            console.log(err);  // handle errors!
                        } else {
                            console.log("saving user ...");
                            done(null, user);
                        }
                    });
                }
            });
        });
    }));

}; 