const User           = require('./models/user');
const IndexNews      = require('./models/indexNews');
const Laptop         = require('./models/beginnerBuild/laptop');
const DesktopA       = require('./models/beginnerBuild/desktopA');
const DesktopW       = require('./models/beginnerBuild/desktopW');
const AdvancedBuilds = require('./models/advancedBuilds');
const ComputerCases  = require('./models/components/computerCases');
const GraphicsBoards = require('./models/components/graphicsBoards');
const HardDrives     = require('./models/components/hardDrives');
const MotherBoards   = require('./models/components/motherBoards');
const PowerSupply    = require('./models/components/powerSupply');
const Processors     = require('./models/components/processors');
const RAM            = require('./models/components/ram');
const SSD            = require('./models/components/ssd');
const functions      = require('../config/functions');
const UserTypes      = require('./models/userTypes');
const Thread         = require('./models/forum/threads');
const Topic          = require('./models/forum/topics');
const Comment        = require('./models/forum/comments');
const Reply          = require('./models/forum/replies');

module.exports = function(app, passport) {

    app.get('/', isNotLoggedIn, function(req, res) {
        res.render('pages/landing.ejs', { layout: false });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/',
        failureFlash : true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home',
        failureRedirect : '/',
        failureFlash : true
    }));

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope : ['user_about_me', 'email', 'public_profile']
    }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/userProfile',
        failureRedirect : '/'
    }));

    app.get('/auth/github', passport.authenticate('github'), function(req, res){});

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/'
    }), function(req, res) {
        res.redirect('/userProfile');
    });

    app.get('/auth/google', passport.authenticate('google', { scope : [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
        ]
    }));

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/'
    }), function(req, res) {
            res.redirect('/userProfile');
        });

    app.get('/auth/instagram', passport.authenticate('instagram', { scope : ['basic'] }), function(req, res){});

    app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/' }), function(req, res) {
        res.redirect('/userProfile');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/userProfile', isLoggedIn, function(req, res) {
        let id = req.user._id;

        return User.findById(id)
            .then((docs)=>{
                return res.render('pages/userProfile.ejs', {
                    title      : 'User Profile',
                    layout     : 'layout.ejs',
                    user       : req.user,
                    url        : req.query.Url,
                    advBuild   : docs.data.builds,
                    desktops   : docs.data.desktops,
                    laptops    : docs.data.laptops
                });
            });
    });

    app.post('/editUserData', function(req, res) {
        let id = req.user._id;

        return User.findById(id)
            .then((docs) => {

                docs.data.firstName   = req.body.firstName;
                docs.data.lastName    = req.body.lastName;
                docs.data.email       = req.body.email;
                docs.data.accountType = req.body.accountType;
                docs.colType          = 0;

                docs.save(functions.save);

                return res.redirect('/userProfile');
            });

    });

    app.get('/home', isLoggedIn, function(req, res) {
        let id = req.user._id;

        Promise.all([
            User.findById(id)
                .then(),
            IndexNews.find({})
                .then()
        ]).then((queryRes) => {
            let model = {
                    title      : 'Home',
                    layout     : 'layout.ejs',
                    user       : req.user,
                    buildArray : queryRes[0].data.builds,
                    news       : queryRes[1]
                };
            res.render('pages/index.ejs', model);
        });
    });

    app.get('/benchmarks', isLoggedIn, (req, res) => {
        const gpu   = parseInt(req.query.gpu);
        const board = parseInt(req.query.board);
        const cpu   = parseInt(req.query.cpu);

        Promise.all([
            GraphicsBoards.find({})
                .then(),
            MotherBoards.find({})
                .then(),
            Processors.find({})
                .then()
        ]).then((queryRes) => {
            const gpuArray   = queryRes[0].sort(functions.sortByMark).reverse();
            const boardArray = queryRes[1].sort(functions.sortByMark).reverse();
            const cpuArray   = queryRes[2].sort(functions.sortByMark).reverse();

            return res.render('pages/benchmarks.ejs', {
                title       : 'Benchmarks',
                layout      : 'buildLayout.ejs',
                user        : req.user,
                gpu         : gpuArray,
                board       : boardArray,
                cpu         : cpuArray,
                gpuTab      : gpu,
                boardTab    : board,
                cpuTab      : cpu
            });
        });
    });

    app.post('/updateMark', (req, res) => {
        const ID      = req.query.id.split('^')[0];
        const colType = parseInt(req.query.id.split('^')[1]);

        switch (colType) {
            case 4:
                Promise.all([
                    GraphicsBoards.findById(ID),
                    GraphicsBoards.find()
                ]).then((queryRes) => {
                    const mark    = parseInt(queryRes[0].mark);
                    const newMark = mark + 1;
                    let markArray = [];
                    let max       = 0;

                    queryRes[1].forEach((item) => {
                        markArray.push(parseInt(item.mark));
                    });

                    markArray.forEach((item) => {
                        if (max < item) {
                            max = item;
                        }
                    });

                    queryRes[0].mark = newMark;
                    queryRes[0].markPercentage = String(((newMark / max) * 100).toFixed(0));
                    queryRes[0].save(functions.save);

                    queryRes[1].forEach((item) => {
                        item.markPercentage = String(((parseInt(item.mark) / max) * 100).toFixed(0));
                        item.save(functions.save);
                    });

                    res.redirect('/benchmarks?gpu=1&board=0&cpu=0');
                });
                break;
            case 7:
                Promise.all([
                    MotherBoards.findById(ID),
                    MotherBoards.find()
                ]).then((queryRes) => {
                    const mark    = parseInt(queryRes[0].mark);
                    const newMark = mark + 1;
                    let markArray = [];
                    let max       = 0;

                    queryRes[1].forEach((item) => {
                        markArray.push(parseInt(item.mark));
                    });

                    markArray.forEach((item) => {
                        if (max < item) {
                            max = item;
                        }
                    });

                    queryRes[0].mark = newMark;
                    queryRes[0].markPercentage = String(((newMark / max) * 100).toFixed(0));
                    queryRes[0].save(functions.save);

                    queryRes[1].forEach((item) => {
                        item.markPercentage = String(((parseInt(item.mark) / max) * 100).toFixed(0));
                        item.save(functions.save);
                    });

                    res.redirect('/benchmarks?gpu=0&board=1&cpu=0');
                });
                break;
            case 9:
                Promise.all([
                    Processors.findById(ID),
                    Processors.find()
                ]).then((queryRes) => {
                    const mark    = parseInt(queryRes[0].mark);
                    const newMark = mark + 1;
                    let markArray = [];
                    let max       = 0;

                    queryRes[1].forEach((item) => {
                        markArray.push(parseInt(item.mark));
                    });

                    markArray.forEach((item) => {
                        if (max < item) {
                            max = item;
                        }
                    });

                    queryRes[0].mark = newMark;
                    queryRes[0].markPercentage = String(((newMark / max) * 100).toFixed(0));
                    queryRes[0].save(functions.save);

                    queryRes[1].forEach((item) => {
                        item.markPercentage = String(((parseInt(item.mark) / max) * 100).toFixed(0));
                        item.save(functions.save);
                    });

                    res.redirect('/benchmarks?gpu=0&board=0&cpu=1');
                });
                break;
            default:
                res.redirect('/benchmarks');
        }
    });

    app.get('/build', isLoggedIn, function(req, res) {
        const id     = req.user._id;
        const failed = req.query.n;

        Promise.all([
            ComputerCases.find({}),
            GraphicsBoards.find({}),
            HardDrives.find({}),
            MotherBoards.find({}),
            PowerSupply.find({}),
            Processors.find({}),
            RAM.find({}),
            SSD.find({}),
            User.findById(id)
        ]).then((queryRes) => {
            if (req.user.data.accountType === 'advanced') {
                let model              = {
                    title              : 'Build',
                    layout             : 'buildLayout.ejs',
                    user               : req.user,
                    casesArray         : queryRes[0],
                    gpuArray           : queryRes[1],
                    hddArray           : queryRes[2],
                    boardArray         : queryRes[3],
                    powerSupplyArray   : queryRes[4],
                    cpuArray           : queryRes[5],
                    ramArray           : queryRes[6],
                    ssdArray           : queryRes[7],
                    buildArray         : queryRes[8].data.builds
                };
                return res.render('pages/advanced/advancedBuild.ejs', model);
            } else if (req.user.data.accountType === 'beginner') {
                let model = {
                    title      : 'Build',
                    layout     : 'buildLayout.ejs',
                    user       : req.user,
                    buildArray : queryRes[8].data.builds,
                    failed     : failed
                };
                return res.render('pages/beginner/beginnerBuild.ejs', model);
            } else {
                let url = req.originalUrl;
                return res.redirect('/userProfile' + '?Url=' + url);
            }
        });

    });

    app.post('/beginnerBuild', function (req, res) {
        let score = 0;

        if (req.body.type === 'Laptop') {
            score += 1;
        } else if (req.body.type === 'Desktop') {
            score += 100;
        }

        if (req.body.movies === 'Yes') {
            score += 1;
        } else if (req.body.movies === 'No') {
            score += 2;
        }

        if (req.body.internet === 'Yes') {
            score += 1;
        } else if (req.body.internet === 'No') {
            score += 2;
        }

        if (req.body.userChoice === 'Small') {
            score += 1;
        } else if (req.body.userChoice === 'Average') {
            score += 2;
        } else if (req.body.userChoice === 'Big') {
            score += 3;
        } else if (req.body.userChoice === 'Not quite') {
            score += 10;
        } else if (req.body.userChoice === 'Often') {
            score += 20;
        } else if (req.body.userChoice === 'Very often') {
            score += 30;
        }

        if (req.body.apple === 'Apple') {
            score += 1;
        } else if (req.body.windows === 'Windows') {
            score += 10;
        }

        if (req.body.low === 'low') {
            score += 1;
        } else if (req.body.average === 'average') {
            score += 2;
        } else if (req.body.big === 'big') {
            score += 3;
        }

        if (score < 100) {

            res.redirect('/laptop' + '?u=' + score);
        } else {
            switch (score) {
                case 115:
                    res.redirect('/desktopa?u=2');
                    break;
                case 117:
                    res.redirect('/desktopa?u=1');
                    break;
                case 124:
                    res.redirect('/desktopw?u=1');
                    break;
                case 125:
                    res.redirect('/desktopw?u=2');
                    break;
                case 133:
                    res.redirect('/desktopw?u=3');
                    break;
                case 134:
                    res.redirect('/desktopw?u=4');
                    break;
                case 145:
                    res.redirect('/desktopw?u=5');
                    break;
                default:
                    res.redirect('/build?n=n');
            }
        }

    });

    app.get('/laptop', isLoggedIn, function(req, res) {
        let laptop     = parseInt(req.query.u);
        let laptopName = {};

        switch(laptop) {
            case 7:
                laptopName = {'mainName': 'Apple MacBook 12'};
                break;

            case 8:
                laptopName = {'mainName': 'Apple MacBook Air 13'};
                break;

            case 17:
                laptopName = {'mainName': 'ASUS A550VQ-XX010D'};
                break;

            case 18:
                laptopName = {'mainName': 'ASUS P2540UA DM0113R'};
                break;

            case 19:
                laptopName = {'mainName': 'ASUS ROG GL702VM-GC017T'};
                break;

            case 10:
                laptopName = {'mainName': 'Apple MacBook Pro 15'};
                break;

            default:
                res.redirect('/build?n=n');
        }

        return Laptop.findOne(laptopName)
            .then((docs) => {
                return res.render('pages/beginner/laptopBuild.ejs', {
                    layout     : 'buildLayout.ejs',
                    title      : 'Laptop',
                    user       : req.user,
                    array      : docs
                });
            });
    });

    app.post('/laptopBuild', isLoggedIn, function (req, res) {
        const userID   = req.user.id;
        const laptopID = req.query.u;

        return User.findById(userID)
            .then((doc) => {
                doc.data.laptops.push(laptopID);
                doc.save(functions.save);

                return res.redirect('/userProfile');
            });

    });

    app.get('/desktopw', isLoggedIn, function (req, res) {
        const desktopType = req.query.u;
        let totalValue    = 0;

        Promise.all([
            DesktopW.findOne({ 'desktopType': desktopType }, (err, doc) => {
                return doc;
            }).then((doc) => {
                return Promise.all([
                    ComputerCases.findById(doc.computerCase),
                    GraphicsBoards.findById(doc.graphicsBoard),
                    HardDrives.findById(doc.hardDrive),
                    MotherBoards.findById(doc.motherboard),
                    PowerSupply.findById(doc.powerSupply),
                    Processors.findById(doc.processor),
                    RAM.findById(doc.ramMemory),
                    SSD.findById(doc.ssd),
                    doc,
                ]).then((queryRes) => {
                    totalValue += parseFloat(queryRes[0].price) + parseFloat(queryRes[1].price) + parseFloat(queryRes[2].price) +
                        parseFloat(queryRes[3].price) + parseFloat(queryRes[4].price) + parseFloat(queryRes[5].price) + parseFloat(queryRes[6].price) +
                        parseFloat(queryRes[7].price);

                    res.render('pages/beginner/desktopBuild.ejs', {
                        title     : 'Desktop',
                        layout    : 'buildLayout.ejs',
                        user      : req.user,
                        pcCase    : queryRes[0],
                        gpu       : queryRes[1],
                        hdd       : queryRes[2],
                        board     : queryRes[3],
                        power     : queryRes[4],
                        cpu       : queryRes[5],
                        ram       : queryRes[6],
                        ssd       : queryRes[7],
                        desktopID : queryRes[8]._id,
                        value     : totalValue
                    })
                });

            })
        ])
    });

    app.get('/desktopa', isLoggedIn, function (req, res) {
        const desktopID = req.query.u;

        return DesktopA.findOne({'desktopType': desktopID})
            .then((docs) => {
                return res.render('pages/beginner/desktopA.ejs', {
                    title  : 'Desktop',
                    layout : 'buildLayout.ejs',
                    user   : req.user,
                    array  : docs
                })
            });
    });

    app.post('/desktopBuild', isLoggedIn, function (req, res) {
        const desktopID = req.query.id;
        const userID    = req.user._id;

        return User.findById(userID)
            .then((doc) => {
                doc.data.desktops.push(desktopID);
                doc.save(functions.save);

                return res.redirect('/userProfile');
            });

    });

    app.get('/desktopDetails', isLoggedIn, function (req, res) {
        const desktopID   = req.query.u.split('^')[0];
        const desktopType = parseInt(req.query.u.split('^')[1]);
        let totalValue    = 0;

        if (desktopType === 1) {
            Promise.all([
                DesktopW.findById(desktopID, function (err, doc) {
                    return doc;
                }).then((doc) => {
                    return Promise.all([
                        ComputerCases.findById(doc.computerCase),
                        GraphicsBoards.findById(doc.graphicsBoard),
                        HardDrives.findById(doc.hardDrive),
                        MotherBoards.findById(doc.motherboard),
                        PowerSupply.findById(doc.powerSupply),
                        Processors.findById(doc.processor),
                        RAM.findById(doc.ramMemory),
                        SSD.findById(doc.ssd)
                    ]).then((queryRes) => {
                        totalValue += parseFloat(queryRes[0].price) + parseFloat(queryRes[1].price) + parseFloat(queryRes[2].price) +
                            parseFloat(queryRes[3].price) + parseFloat(queryRes[4].price) + parseFloat(queryRes[5].price) + parseFloat(queryRes[6].price) +
                            parseFloat(queryRes[7].price);

                        res.render('pages/beginner/desktopDetails.ejs', {
                            title     : 'Desktop',
                            layout    : 'buildLayout.ejs',
                            user      : req.user,
                            pcCase    : queryRes[0],
                            gpu       : queryRes[1],
                            hdd       : queryRes[2],
                            board     : queryRes[3],
                            power     : queryRes[4],
                            cpu       : queryRes[5],
                            ram       : queryRes[6],
                            ssd       : queryRes[7],
                            value     : totalValue
                        });
                    })
                })
            ])
        } else if (desktopType === 2) {
            return DesktopA.findById(desktopID)
                .then((docs) => {
                    return res.render('pages/beginner/desktopADetails.ejs', {
                        title  : 'Desktop',
                        layout : 'buildLayout.ejs',
                        user   : req.user,
                        array  : docs
                    })
                });
        }
    });

    app.get('/laptopDetails', isLoggedIn, function (req, res) {
        const laptopId = req.query.u;

        return Laptop.findById(laptopId)
            .then((docs) => {
                return res.render('pages/beginner/laptopDetails.ejs', {
                    title  : 'Laptop',
                    layout : 'buildLayout',
                    user   : req.user,
                    array  : docs
                });
            });
    });

    app.post('/build/removeDesktop', isLoggedIn, function (req, res) {
        const userID    = req.user._id;
        const desktopID = req.query.id;

        return User.findById(userID)
            .then((doc) => {
                let index = doc.data.desktops.findIndex(i => i.id === desktopID);
                doc.data.desktops.splice(index, 1);
                doc.save(functions.save);

                return res.redirect('/userProfile');
            });

    });

    app.post('/build/removeLaptop', isLoggedIn, function (req, res) {
        const laptopID = req.query.id;
        const userID   = req.user._id;

        return User.findById(userID)
            .then((doc) => {
                let index = doc.data.laptops.findIndex(i => i.id === laptopID);
                doc.data.laptops.splice(index, 1);
                doc.save(functions.save);

                return res.redirect('/userProfile');
            });

    });

    app.post('/addToCart', function(req, res) {
        let pid      = req.body.pidArray.split(',');
        let config   = req.body.config;
        let id       = req.user._id;
        let buildIds = {};

        for (let item of pid) {
            let collectionType = parseInt(item.split('^')[1]);
            let collectionID   = item.split('^')[0];

            switch(collectionType) {
                case 3: // Computer Case
                    buildIds.caseID          = collectionID;
                    break;
                case 4: // Graphics Board
                    buildIds.gpuID           = collectionID;
                    break;
                case 5: // Hard Drive
                    buildIds.hddID           = collectionID;
                    break;
                case 7: // Motherboard
                    buildIds.boardID         = collectionID;
                    break;
                case 8: // Power Supply
                    buildIds.powerSupplyID   = collectionID;
                    break;
                case 9: // Processor
                    buildIds.cpuID           = collectionID;
                    break;
                case 10: // RAM
                    buildIds.ramID           = collectionID;
                    break;
                case 11: // SSD
                    buildIds.ssdID           = collectionID;
                    break;
                default:
                    break;
            }
        }

        Promise.all([
            (function(err, data) {
                let item = {
                    case        : buildIds.caseID,
                    gpu         : buildIds.gpuID,
                    hdd         : buildIds.hddID,
                    motherboard : buildIds.boardID,
                    powerSupply : buildIds.powerSupplyID,
                    cpu         : buildIds.cpuID,
                    ram         : buildIds.ramID,
                    ssd         : buildIds.ssdID,
                    colType     : 1
                };
                data = AdvancedBuilds(item);

                return data.save(functions.save);
            })(),
            User.findById(id)
        ]).then((queryRes) => {
                queryRes[1].data.builds.push({
                    name : config,
                    id   : queryRes[0]._id
                });
                queryRes[1].save(functions.save);
            });

        res.redirect('/build');
    });

    app.get('/build/configuration-details', isLoggedIn, function (req, res) {
        let id              = req.user._id;
        let configurationID = req.query.id;
        let totalRating     = 0;
        let counter         = 0;
        let totalValue      = 0;

        Promise.all([
            AdvancedBuilds.findById(configurationID, function (err, docs) {
                return docs;
            }).then((docs) => {
                return Promise.all([
                    ComputerCases.findById(docs.case),
                    GraphicsBoards.findById(docs.gpu),
                    HardDrives.findById(docs.hdd),
                    MotherBoards.findById(docs.motherboard),
                    PowerSupply.findById(docs.powerSupply),
                    Processors.findById(docs.cpu),
                    RAM.findById(docs.ram),
                    SSD.findById(docs.ssd),
                    User.findById(id)
                ]).then((queryRes) => {

                    let config = {
                        case        : queryRes[0],
                        gpu         : queryRes[1],
                        hdd         : queryRes[2],
                        board       : queryRes[3],
                        powerSupply : queryRes[4],
                        cpu         : queryRes[5],
                        ram         : queryRes[6],
                        ssd         : queryRes[7]
                    };

                    if (config.case !== null) {
                        totalRating += parseFloat(config.case.rating);
                        totalValue += parseFloat(config.case.price.split(' USD')[0]);
                        counter += 1;
                    }
                    if (config.gpu !== null) {
                        totalRating += parseFloat(config.gpu.rating);
                        totalValue += parseFloat(config.gpu.price.split(' USD')[0]);
                        counter += 1;
                    }
                    if (config.hdd !== null) {
                        totalRating += parseFloat(config.hdd.rating);
                        totalValue += parseFloat(config.hdd.price.split(' USD')[0]);
                        counter += 1;
                    }
                    if (config.board !== null) {
                        totalRating += parseFloat(config.board.rating);
                        totalValue += parseFloat(config.board.price.split(' USD')[0]);
                        counter += 1;
                    }
                    if (config.powerSupply !== null) {
                        totalRating += parseFloat(config.powerSupply.rating);
                        totalValue += parseFloat(config.powerSupply.price.split(' USD')[0]);
                        counter += 1;
                    }
                    if (config.cpu !== null) {
                        totalRating += parseFloat(config.cpu.rating);
                        totalValue += parseFloat(config.cpu.price.split(' USD')[0]);
                        counter += 1;
                    }
                    if (config.ram !== null) {
                        totalRating += parseFloat(config.ram.rating);
                        totalValue += parseFloat(config.ram.price.split(' USD')[0]);
                        counter += 1;
                    }
                    if (config.ssd !== null) {
                        totalRating += parseFloat(config.ssd.rating);
                        totalValue += parseFloat(config.ssd.price.split(' USD')[0]);
                        counter += 1;
                    }

                    totalRating = (totalRating / counter).toFixed(1);

                    res.render('pages/configurationDetails.ejs', {
                        title       : 'Configuration Details',
                        layout      : 'buildLayout.ejs',
                        user        : req.user,
                        Config      : config,
                        buildArray  : queryRes[8].data.builds,
                        buildID     : configurationID,
                        rating      : totalRating,
                        value       : totalValue
                    });
                });
            }),

        ]);
    });

    app.post('/build/remove-component', function (req, res) {
        let componentID = req.query.id.split('^')[0];
        let buildID     = req.query.id.split('^')[1];

        return AdvancedBuilds.findById(buildID)
            .then((doc) => {
                for (let key in doc) {
                    if(doc[key] === componentID) {
                        doc[key] = null;
                    }
                }

                doc.save(functions.save);

                return res.redirect('/build/configuration-details?id=' + buildID);
            });

    });

    app.get('/build/add-component', isLoggedIn, function (req, res) {
        let missingFields       = req.query.fields.split('^')[0].split(',');
        let buildID             = req.query.fields.split('^')[1];
        let missingFieldsObject = {};

        Promise.all([
            ComputerCases.find({}),
            GraphicsBoards.find({}),
            HardDrives.find({}),
            MotherBoards.find({}),
            PowerSupply.find({}),
            Processors.find({}),
            RAM.find({}),
            SSD.find({})
        ]).then((queryRes) => {
            missingFields.forEach(function (item) {
                switch (item) {
                    case 'case':
                        missingFieldsObject.pcCase      = queryRes[0];
                        break;
                    case 'gpu':
                        missingFieldsObject.gpu         = queryRes[1];
                        break;
                    case 'hdd':
                        missingFieldsObject.hdd         = queryRes[2];
                        break;
                    case 'board':
                        missingFieldsObject.motherboard = queryRes[3];
                        break;
                    case 'powerSupply':
                        missingFieldsObject.powerSupply = queryRes[4];
                        break;
                    case 'cpu':
                        missingFieldsObject.cpu         = queryRes[5];
                        break;
                    case 'ram':
                        missingFieldsObject.ram         = queryRes[6];
                        break;
                    case 'ssd':
                        missingFieldsObject.ssd         = queryRes[7];
                        break;
                    default:
                        break;
                }
            });

            res.render('pages/addComponent.ejs', {
                title       : 'Add Component',
                layout      : 'buildLayout.ejs',
                user        : req.user,
                buildArray  : req.user.data.builds,
                BuildID     : buildID,
                pcCase      : missingFieldsObject.pcCase,
                gpu         : missingFieldsObject.gpu,
                hdd         : missingFieldsObject.hdd,
                powerSupply : missingFieldsObject.powerSupply,
                board       : missingFieldsObject.motherboard,
                cpu         : missingFieldsObject.cpu,
                ram         : missingFieldsObject.ram,
                ssd         : missingFieldsObject.ssd,
            });
        });

    });

    app.post('/build/addBackToCart', function (req, res) {
        let buildArray = req.body.pidArray.split(',');
        let BuildID    = req.body.buildID;

        return AdvancedBuilds.findById(BuildID)
            .then((doc) => {
                buildArray.forEach(function (item) {
                    let ProductID = item.split('^')[0];
                    let CollectionType = parseInt(item.split('^')[1]);

                    switch (CollectionType) {
                        case 3:
                            doc.case = ProductID;
                            doc.save(functions.save);
                            break;
                        case 4:
                            doc.gpu = ProductID;
                            doc.save(functions.save);
                            break;
                        case 5:
                            doc.hdd = ProductID;
                            doc.save(functions.save);
                            break;
                        case 7:
                            doc.motherboard = ProductID;
                            doc.save(functions.save);
                            break;
                        case 8:
                            doc.powerSupply = ProductID;
                            doc.save(functions.save);
                            break;
                        case 9:
                            doc.cpu = ProductID;
                            doc.save(functions.save);
                            break;
                        case 10:
                            doc.ram = ProductID;
                            doc.save(functions.save);
                            break;
                        case 11:
                            doc.ssd = ProductID;
                            doc.save(functions.save);
                            break;
                        default:
                            break;
                    }
                });

                return res.redirect('/build/configuration-details?id=' + BuildID);
            });

    });

    app.post('/build/removeBuild', function (req, res) {
        let buildID = req.query.id.split('^')[0];
        let id      = req.query.id.split('^')[1];

        return User.findById(id)
            .then((doc) => {
                let index = doc.data.builds.findIndex(i => i.id === buildID);
                doc.data.builds.splice(index, 1);
                doc.save(functions.save);

                return res.redirect('/userProfile');
            });

    });

    app.get('/forum', isLoggedIn, (req, res) => {
         Promise.all([
             User.findById(req.user._id)
                 .then(),
             User.find({})
                 .then(),
             Thread.find({})
                 .populate('postedBy')
                 .populate('topics')
                 .then()
         ]).then((queryRes) => {
             res.render('pages/forum/forum.ejs', {
                 title   : 'Forum',
                 layout  : 'forumLayout.ejs',
                 user    : queryRes[0],
                 users   : queryRes[1],
                 threads : queryRes[2]
             });
         });
    });

    app.post('/addThread', (req, res) => {
        const type = req.query.type;

        let thread = new Thread({
            type        : Number(type),
            title       : req.body.title,
            description : req.body.description,
            postedBy    : req.user._id,
            archived    : false
        });

        thread.save(functions.save);

        res.redirect('/forum');

    });

    app.post('/archiveTopic', (req, res) => {
        const topicID = req.body.topic;

        return Topic.findById(topicID)
            .populate('fromThread')
            .then((docs) => {
                docs.archived = true;
                docs.save(functions.save);

                res.redirect('/threadTopics?threadID=' + docs.fromThread._id);
            });
    });

    app.post('/archiveThread', (req, res) => {
        const threadID = req.body.thread;

        return Thread.findById(threadID)
            .then((docs) => {
                docs.archived = true;
                docs.save((err) => {
                    if (!err) {
                        return Topic.find({'fromThread._id': threadID})
                            .exec((err, topics) => {
                                if (!err) {
                                    topics.archived = false;
                                    topics.save(functions.save);
                                } else {
                                    throw err;
                                }
                            })
                    } else {
                        throw err;
                    }
                });

                res.redirect('/forum');
            });
    });

    app.get('/archives', isLoggedIn, (req, res) => {
        const userID = req.user._id;

        Promise.all([
            User.findById(userID)
                .then(),
            User.find({})
                .then(),
            Thread.find({})
                .populate('postedBy')
                .populate('topics')
                .then(),
            Topic.find({'archived': true})
                .populate('fromThread')
                .populate('postedBy')
                .populate('comments')
                .then()
        ]).then((queryRes) => {
            res.render('pages/forum/archive.ejs', {
                title   : 'Forum Archives',
                layout  : 'forumLayout.ejs',
                user    : queryRes[0],
                users   : queryRes[1],
                threads : queryRes[2],
                topics  : queryRes[3]
            });
        });
    });

    app.get('/archivedThread', isLoggedIn, (req, res) => {
        const threadID = req.query.threadID;
        const userID   = req.user._id;

        Promise.all([
            User.findById(userID)
                .then(),
            User.find({})
                .then(),
            Thread.findById(threadID)
                .populate('postedBy')
                .populate('topics')
                .then(),
            Topic.find({'fromThread': threadID})
                .populate('postedBy')
                .populate('fromThread')
                .populate('comments')
                .then()
        ]).then((queryRes) => {
            res.render('pages/forum/archivedThread.ejs', {
                title  : queryRes[2].title,
                layout : 'forumLayout.ejs',
                user   : queryRes[0],
                users  : queryRes[1],
                thread : queryRes[2],
                topics : queryRes[3]
            });
        });
    });

    app.get('/threadTopics', isLoggedIn, (req, res) => {
        const userID   = req.user._id;
        const threadID = req.query.threadID;

        Promise.all([
            User.find({})
                .then(),
            User.findById(userID)
                .then(),
            Thread.findById(threadID)
                .populate('postedBy')
                .populate('topics')
                .then(),
            Topic.find({'fromThread': threadID})
                .populate('fromThread')
                .populate('postedBy')
                .then()
        ]).then((queryRes) => {
            res.render('pages/forum/threadTopics.ejs', {
                title    : queryRes[2].title,
                layout   : 'forumLayout.ejs',
                users    : queryRes[0],
                user     : queryRes[1],
                thread   : queryRes[2],
                topics   : queryRes[3]
            });
        });
    });

    app.post('/addTopic', (req, res) => {
        const threadID = req.query.threadID;

        let topic = new Topic({
            title       : req.body.title,
            description : req.body.description,
            fromThread  : threadID,
            postedBy    : req.user._id,
            archived    : false
        });

        topic.save((err) => {
            if (!err) {
                Thread.findById(threadID)
                    .populate('postedBy')
                    .populate('topics')
                    .exec((err, thread) => {
                        if (!err) {
                            thread.topics.push(topic._id);
                            thread.save(functions.save);
                        }
                    })
            }
        });

        res.redirect('/threadTopics?threadID=' + threadID);
    });

    app.get('/topic', isLoggedIn, (req, res) => {
        const userID  = req.user._id;
        const topicID = req.query.topicID;

        Promise.all([
            User.findById(userID)
                .then(),
            User.find({})
                .then(),
            Topic.findById(topicID)
                .populate('fromThread')
                .populate('postedBy')
                .then(),
            Comment.find({'fromTopic': topicID})
                .populate('postedBy')
                .populate('fromTopic')
                .then(),
            Reply.find({})
                .populate('postedBy')
                .populate('ofComment')
                .then()
        ]).then((queryRes) => {
            res.render('pages/forum/topic.ejs', {
                title    : queryRes[2].title,
                layout   : 'forumLayout.ejs',
                user     : queryRes[0],
                users    : queryRes[1],
                topic    : queryRes[2],
                comments : queryRes[3],
                replies  : queryRes[4]
            })
        });
    });

    app.post('/comment', (req, res) => {
        const topicID = req.query.topicID;

        let comment = new Comment({
            text      : req.body.text,
            postedBy  : req.user._id,
            fromTopic : topicID
        });

        comment.save((err) => {
            if (!err) {
                Topic.findById(topicID)
                    .populate('fromThread')
                    .populate('postedBy')
                    .populate('comments')
                    .exec((err, comments) => {
                        if (!err) {
                            comments.comments.push(comment._id);
                            comments.save(functions.save);
                        }
                    });
            }
        });

        res.redirect('/topic?topicID=' + topicID);
    });

    app.post('/reply', (req, res) => {
        const userID    = req.query.id;
        const commentID = req.query.commentID;
        const topicID   = req.query.topicID;

        let reply = new Reply({
            text      : req.body.textReply,
            postedBy  : userID,
            ofComment : commentID
        });

        reply.save((err) => {
            if (!err) {
                Comment.findById(commentID)
                    .populate('postedBy')
                    .populate('fromTopic')
                    .populate('replies')
                    .exec((err, comments) => {
                        if (!err) {
                            comments.replies.push(reply._id);
                            comments.save(functions.save);
                        }
                    });
            }
        });

        res.redirect('/topic?topicID=' + topicID);
    });

    app.get('/userData', isLoggedIn, (req, res) => {
        const userID = req.user._id;

        Promise.all([
            User.find({})
                .then(),
            UserTypes.find({})
                .then(),
            User.findById(userID)
                .then()
        ]).then((queryRes) => {
            if (queryRes[2].data.userType !== 'god' && queryRes[2].data.userType !== 'demigod') {
                res.redirect('/home');
            } else {
                res.render('pages/userData.ejs', {
                    title     : 'User Data',
                    layout    : 'buildLayout.ejs',
                    user      : req.user,
                    users     : queryRes[0],
                    userTypes : queryRes[1]
                });
            }
        })
    });

    app.post('/updateUserType', (req, res) => {
        const userID = req.query.id;

        return User.findById(userID)
            .then((docs) => {
                docs.data.userType = req.body.typeUser;

                docs.save(functions.save);

                res.redirect('/userData');
            })
    });

    app.post('/removeUser', (req, res) => {
        const userID = req.query.id;

        return User.findById(userID)
            .then((docs) => {
                const time      = Date.now();
                let t           = new Date(time);
                docs.deletedAt = t.toDateString();

                docs.save(functions.save);

                res.redirect('/userData');
            })
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Logged in");
        return next();
    }
    else {
        res.redirect('/');
    }
}

function isNotLoggedIn(req, res, next) {
    if (req.isUnauthenticated()) {
        console.log("Not logged in");
        return next();
    }
    else {
        res.redirect('/home');
    }

}