var app = {
    
    
    // findByName: function() {
    //     console.log('findByName');
    //     // this.store.findByName($('.search-key').val(), function(employees) {
    //     //     var l = employees.length;
    //     //     var e;
    //     //     $('.employee-list').empty();
    //     //     for (var i=0; i<l; i++) {
    //     //         e = employees[i];
    //     //         $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
    //     //     }
    //     // });
    //     /// use template
    //     var self = this;
    //     this.store.findByName($('.search-key').val(), function(employees) {
    //         $('.employee-list').html(self.employeeLiTpl(employees));
    //     });
    // },

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },
    // renderHomeView: function() {
    //     // var html =
    //     //         "<div class='header'><h1>Home</h1></div>" +
    //     //         "<div class='search-view'>" +
    //     //         "<input class='search-key'/>" +
    //     //         "<ul class='employee-list'></ul>" +
    //     //         "</div>"
    //     // $('body').html(html);
    //     // $('.search-key').on('keyup', $.proxy(this.findByName, this));

    //     //// use template
    //     $('body').html(this.homeTpl());
    //     $('.search-key').on('keyup', $.proxy(this.findByName, this));
    // },


    ///register events for the click to be blue background
    registerEvents: function() {
        var self = this;
        // Check of browser supports touch events...
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('body').on('touchstart', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('touchend', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        } else {
            // ... if not: register mouse events instead
            $('body').on('mousedown', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('mouseup', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        }

        $(window).on('hashchange', $.proxy(this.route, this));

    },


    route: function() {
        var self = this;
        var hash = window.location.hash;
        if (!hash) {
            // $('body').html(new HomeView(this.store).render().el);
            // return;
            if (this.homePage) {
                this.slidePage(this.homePage);
            } else {
                this.homePage = new HomeView(this.store).render();
                this.slidePage(this.homePage);
            }
            return;
        }
        var match = hash.match(app.detailsURL);
        if (match) {
            this.store.findById(Number(match[1]), function(employee) {
                // $('body').html(new EmployeeView(employee).render().el);
                self.slidePage(new EmployeeView(employee).render());
            });
        }
    },

    slidePage: function(page) {
     
        var currentPageDest,
            self = this;
     
        // If there is no current page (app just started) -> No transition: Position new page in the view port
        if (!this.currentPage) {
            $(page.el).attr('class', 'page stage-center');
            $('body').append(page.el);
            this.currentPage = page;
            return;
        }
     
        // Cleaning up: remove old pages that were moved out of the viewport
        $('.stage-right, .stage-left').not('.homePage').remove();
     
        if (page === app.homePage) {
            // Always apply a Back transition (slide from left) when we go back to the search page
            $(page.el).attr('class', 'page stage-left');
            currentPageDest = "stage-right";
        } else {
            // Forward transition (slide from right)
            $(page.el).attr('class', 'page stage-right');
            currentPageDest = "stage-left";
        }
     
        $('body').append(page.el);
     
        // Wait until the new page has been added to the DOM...
        setTimeout(function() {
            // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
            $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
            // Slide in the new page
            $(page.el).attr('class', 'page stage-center transition');
            self.currentPage = page;
        });
     
    },

    // showAlert: function (message, title) {
    //     if (navigator.notification) {
    //         navigator.notification.alert(message, null, title, 'OK');
    //     } else {
    //         // alert(title ? (title + ": " + message) : message);
    //         alert("alert from browser");
    //     }
    // },

    initialize: function() {
        var self = this;
        // this.homeTpl = Handlebars.compile($("#home-tpl").html());
        // this.employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());
        // this.store = new MemoryStore(function() {
        //     // self.showAlert('Store Initialized', 'Info');
        //     self.renderHomeView();
        // });
        // $('.search-key').on('keyup', $.proxy(this.findByName, this));
        this.store = new MemoryStore(function() {
            //$('body').html(new HomeView(self.store).render().el);
            self.route();
            // self.showAlert('Store Initialized', 'Info');
        });
        this.registerEvents();
        this.detailsURL = /^#employees\/(\d{1,})/;
    }
};

app.initialize();