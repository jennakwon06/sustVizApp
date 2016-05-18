Template.HomePrivate.rendered = function() {
    $.getScript("/utility.js");
    $.getScript("/globalFunctions.js");
    $.getScript("/filters.js");
    $.getScript("/dc.js");
    $.getScript("/worldmap.js", function(data, textStatus, jdxhr) {
        drawMap();
    });
    $.getScript("/scatterplot.js", function( data, textStatus, jqxhr ) {
        onChange();
    });

    Meteor.subscribe('userFilters');
    Meteor.subscribe('userResults');
    Meteor.subscribe('fs.files');

    console.log("rendering from homeprivate js");

};

var i = 0;

var findPDFs = function(company) {
    // Check if database is correctly set up
    console.log(PDFs.find().count());
    console.log(PDFs.find({}));

    var regex = new RegExp('^' + company, 'i');

    // @TODO use regex to find a file by name
    return PDFs.find({}).fetch();
};

Template.HomePrivate.events({
//<!------ CONTROL BAR ---->
    'click #resetEmissions' : function (e) {
        ghg1Chart.filterAll();
        ghg2Chart.filterAll();
        ghg3Chart.filterAll();
    },

    // Switch between views
    'click #resultListViewButton': function (e) {
        $('.resultListView').attr("style", "display: block");
        $('.resultMapView').attr("style", "display: none");
        $('.resultScatterPlotView').attr("style", "display: none");

    },
    'click #resultMapViewButton': function (e) {
        $('.resultListView').attr("style", "display: none");
        $('.resultMapView').attr("style", "display: block");
        $('.resultScatterPlotView').attr("style", "display: none");

    },
    'click #resultScatterPlotViewButton': function (e) {
        $('.resultListView').attr("style", "display: none");
        $('.resultMapView').attr("style", "display: none");
        $('.resultScatterPlotView').attr("style", "display: block");

    },

    'click #collapseFilterButton': function(e) {
        if (i % 2 == 0) {
            $('#controlBar').animate({
                left: "0px"
            }, 500, function() {});

            $('#filterBar').animate({
                opacity: 0
            }, 500, function() {});

            $('#resultBar').css({"width" : "96vw","position" :"fixed"});

            $(".glyphicon-arrow-left").addClass( "glyphicon-arrow-right");
            $(".glyphicon-arrow-right").removeClass( "glyphicon-arrow-left");

        } else {
            $(".glyphicon-arrow-right").addClass( "glyphicon-arrow-left");
            $(".glyphicon-arrow-left").removeClass( "glyphicon-arrow-right");

            $('#resultBar').removeAttr("style");
            $('#controlBar').removeAttr("style");

            $('#filterBar').animate({
                opacity: 1
            }, 500, function() {

            });
        }
        i++;
    },

    // Update number counter button
    //'click rect': function (e) {
    //    $('.companiesCount').empty();
    //    $('.companiesCount').html(globalFilter.top(Infinity).length);
    //},

    'click #resetAllFiltersButton': function(e) {
        dc.redrawAll();
        dc.filterAll();
        //$('.companiesCount').html(globalFilter.top(Infinity).length);
    },

    'click #scrollToGeneral': function(e) {
        console.log($(".panelGeneral").offset().top);

        $('#filterBar').animate({
            scrollTop: 0
        }, 500);
    },
    
    'click #scrollToEmissions': function(e) {
        console.log($(".panelEmissions").offset().top);

        $('#filterBar').animate({
            scrollTop: 516 - 120
        }, 500);
    },
    

    'click #scrollToWater': function(e) {
        console.log($(".panelWater").offset().top);

        $('#filterBar').animate({
            scrollTop: 894 - 120
        }, 500);
    },

    'click #scrollToWaste': function(e) {
        console.log($(".panelWaste").offset().top);

        $('#filterBar').animate({
            scrollTop: 1272 - 120
        }, 500);
    },

    'click #scrollToEnergy': function(e) {
        console.log($(".panelEnergy").offset().top);

        $('#filterBar').animate({
            scrollTop: 1650 - 120
        }, 500);
    },

    'click #scrollToMisc': function(e) {
        console.log($(".panelMisc").offset().top);

        $('#filterBar').animate({
            scrollTop: 1826 - 120
        }, 500);
    },

    'click #saveResultButton': function (e) {
        e.preventDefault();

        var resultsArr = [];

        $(".clickableRow").each(function (i) {
            resultsArr.push(this.id);
        });

        Meteor.call('saveResults', resultsArr, Meteor.userId(), new Date());
    },

//<!----- LIST VIEW ---->

    'click .clickableRow': function (e) {
        e.preventDefault();

        var name = $(e.currentTarget).attr('id');
        $(e.currentTarget).addClass('highlight');
        $(e.currentTarget).siblings().removeClass('highlight');

        console.log(name);

        var $target = $(e.currentTarget);
        if ( $target.closest("td").attr("colspan") > 1 ) {
            $target.slideUp();
        } else {
            $target.closest("tr").next().find("td").slideToggle("fast");
        }

    },

    'click #closeModalButton': function (e) {
        $('.list-group').empty();

        $('tbody > .clickableRow').removeClass('highlight');
    },

// @TODO MAP STUFF
    'click .mapCircle': function (e) {
        d3.select(".list-group")
            .append("li")
            .attr("class", "modal-list-item list-group-item")
            .attr("value", 10)
            .attr("id", 10);
    },


    'click #submitDropdown' : function(e) {
    //    http://www.w3schools.com/jsref/coll_select_options.asp

    }
});

Template.HomePrivate.helpers({
    pdfs: function () {
        return PDFs.find(); // Where Images is an FS.Collection instance
    }

});
