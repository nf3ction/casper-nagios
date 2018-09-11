//This is a js file to test the availability of www.BLANK.com using casperjs/phantomjs

phantom.injectJs("blank_rd_user.js")

//Screenshot error for debugging if the test has an error executing
casper.on('step.error', function(err) {
    casper.page.evaluate(function() {
        document.body.bgColor = 'white';
    });
    casper.captureSelector("error.png", "html");
    this.die("Step failed: " + err + " See error.png for more info");
});

//Oputput console.log messages into output
casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
})

//Ouptute page errors into output
casper.on( 'page.error', function (msg, trace) {
    this.echo( 'Error: ' + msg, 'ERROR' );
});

//Casper Options
//Setting the screensize to 1920x1080
casper.options.viewportSize = {
    width: 1920,
    height: 1080
};

//Start Test section
//Setting the starting url to BLANK
casper.test.begin('casper_test_1', function(test) {
    casper.start('https://www.BLANK.com');

    //Username Section
    //Wait for username fields
    //This info was captured from a Resurrectio recorder chrome plugin
    casper.waitForSelector("form#loginForm input[name='UserName']",
        //If the username input box loads
        function success() {
            //Verify the field exists
            test.assertExists("form#loginForm input[name='UserName']");
            //Click into the username field
            this.click("form#loginForm input[name='UserName']");
            //Enter the username specified while keeping the field in focus
            this.sendKeys("input[name='UserName']", "" + username, {
                keepFocus: true
            });
            //Send "Enter" key to submit the username
            this.sendKeys("input[name='UserName']", casper.page.event.key.Enter);
        },
        //If the username box does not load
        function fail() {
            //If the login form or the field does not load
            test.assertExists("form#loginForm input[name='UserName']");
            test.assertExists("input[name='UserName']");
            this.echo("Username failed");
        });

    //Password Section
    //Wait for the password fields
    //This info was caputed from a Resurrectio recorder chrome plugin
    casper.waitForSelector("form#loginForm input[name='Password']",
        //If the password input box loads
        function success() {
            //Verify the field exists
            casper.capture("currentscreen2.png");
            test.assertExists("form#loginForm input[name='Password']");
            //Click the password field
            this.click("form#loginForm input[name='Password']");
            //Enter the passowrd specified while keeing the field in focus 
            this.sendKeys("input[name='Password']", "" + password, {
                keepFocus: true
            });
            //Send "Enter" key to submit the password
            this.sendKeys("input[name='Password']", casper.page.event.key.Enter, {
                keepFocus: true
            });
        },
        //If the password input box does not load
        function fail() {
            //If the login form or field does not load
            test.assertExists("form#loginForm input[name='Password']");
            test.assertExists("input[name='Password']");
            this.echo("Password failed");
        });

    //Verify password worked
    //Need to expand this section casper/phantom can access the site properly
    casper.waitForText("BLANK", 
        function success() {
            this.echo("test");
            //Caputre screenshot of page after logging in
            this.capture("currentscreen1.png");
    });

    //Finish the test
    casper.run(function() {
        test.done();
    });
});
