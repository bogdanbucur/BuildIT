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

                    newUser.local.username = username;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.data.userType  = 'user';

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
            User.findOne({'facebook.id': profile.id}, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    const newUser            = new User();

                    newUser.facebook.id      = profile.id;
                    newUser.facebook.token   = token;
                    newUser.facebook.name    = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email   = profile.emails[0].value;
                    newUser.facebook.image   = profile.photos[0].value;
                    const time               = Date.now();
                    let t                    = new Date(time);
                    newUser.facebook.created = t.toDateString();
                    newUser.data.userType    = 'user';

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
            User.findOne({'github.oauthID': profile.id}, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    const newUser          = new User();

                    newUser.github.oauthID = profile.id;
                    newUser.github.name    = profile.username;
                    newUser.github.image   = profile._json.avatar_url;
                    const time             = Date.now();
                    let t                  = new Date(time);
                    newUser.github.created = t.toDateString();
                    newUser.data.userType  = 'user';

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
            User.findOne({'google.oauthID': profile.id}, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    user                  = new User();

                    user.google.oauthID   = profile.id;
                    user.google.firstName = profile.name.givenName;
                    user.google.lastName  = profile.name.familyName;
                    user.google.email     = profile.email;
                    user.google.image     = profile.photos[0].value;
                    const time            = Date.now();
                    let t                 = new Date(time);
                    user.google.created   = t.toDateString();
                    user.data.userType    = 'user';

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
            User.findOne({'instagram.oauthID': profile.id}, function (err, user) {
                console.log(profile);
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    user                     = new User();

                    user.instagram.oauthID   = profile.id;
                    user.instagram.username  = profile.username;
                    user.instagram.firstName = profile.displayName.split(' ')[0];
                    user.instagram.lastName  = profile.displayName.split(/[, ]+/).pop();
                    user.instagram.image     = profile._json.data.profile_picture;
                    const time               = Date.now();
                    let t                    = new Date(time);
                    user.instagram.created   = t.toDateString();
                    user.data.userType       = 'user';

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