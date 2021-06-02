/// <reference path="jquery-3.6.0.js" />
"use strict";

// when document is finished loading we invoke this function 
$(function () {



    function searchCards() {
        //showing loading icon

        const cardsTitles = $("h5.card-title");
        const cardsTexts = $("p.card-text");
        const filter = $('#search-input').val().toLowerCase();
        const showSpinner = () => {
            $(".fa-search").show();
            $("#search-spinner").hide();
        };
        if (!filter) {
            showSpinner();
            return;
        }

        const checkText = (text) => {
            const txtValue = text.toLowerCase();
            return txtValue === filter;
        };

        let contain = false;
        for (let i = 0; i < cardsTexts.length; i++) {
            const card = $($(cardsTexts[i]).parentsUntil("div.cards")); // parent card
            const title = $(cardsTitles[i]).text() // the innerHtml for title
            const currencyName = $(cardsTexts[i]).text()

            if (checkText(title) || checkText(currencyName)) {
                // $(card[1]).show();//getting the whole card
                contain = true;
            }
            if (!contain) {
                $(card[1]).hide();
            }
            contain = false;
        }
        showSpinner();
    }

    function changeLinksColor(comLink) {
        //changing the links color in nav area
        const linksIDs = ["#currenciesLink", "#liveReportsLink", "#aboutLink"];
        const componentIndex = linksIDs.indexOf(comLink);
        linksIDs.splice(componentIndex, 1)
         // taking each link and checking if contains the active class if yes then remove it
        linksIDs.map((element) => {
            if($(element).hasClass('nav-link-active')){
                $(element).removeClass('nav-link-active');
            }
        });
        $(comLink).addClass('nav-link-active');
    }

    const scrollDown = (componentID) => {
        setTimeout(() => {
            $('html, body').animate({
                scrollTop: $(componentID).offset().top
            }, 'slow');
        }, 700);

    };

    const changeBgHeight = (height) => {
        $(".bg-area").animate({ height: `${height}vh` }, 500);
    };

    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // if the currencies link is clicked when we show all the relevant components
    // then we show create event listeners
    $("#currenciesLink").on('click', function () {

        // changing the bg height
        changeBgHeight(95);
        // the whole section is built
        buildCurrencySection();
        // change links color
        changeLinksColor("#currenciesLink");
        // displaying the currency cards
        displayTop100();
        //scroll down after all is finished
        scrollDown("#currenciesComponent");
        // when a click event happens on an info button we use the wrapper
        //element in order to catch the event
        $("div.cards").on('click', 'a.btn-info', function () {
            // the prev of the btn-info is the card the hidden collapsed div
            showCurrency($(this).prev().attr('id').replace("-collapse", ""))
        });

        //for when a client clicks on the search button 
        $('#search-btn').on('click', function () {
            $(".fa-search").hide();
            $("#search-spinner").show();
            setTimeout(() => {
                searchCards()
            }, 600);
        });

        //when the little x button is clicked in the search bar in cards container 
        $('#search-input').on('search', function () {
            (() => {
                const cards = $("div.cards").children();
                for (const card of cards) {
                    if (!($(card).is(":visible"))) {
                        $(card).show()
                    }
                }
            })();
        });

        $("div.cards").on('click', 'input.card-checkbox', function () {
            addCheckedCurrency($(this));
        });
    });

    // #################################
    // when the live reports link is clicked 
    $("#liveReportsLink").on('click', function () {

        if ($("#liveReportsComponent").length) {
            // if already in page
            scrollDown("#liveReportsComponent");
            return;
        }
        // changing the bg height
        changeBgHeight(95);
        // first we show the canvas
        buildLiveReportsSection();
        //creating the canvas
        createCanvas();
        // change links color
        changeLinksColor("#liveReportsLink");

        //updating the canvas
        let startTime = new Date().getTime();
        updateCanvas(startTime);
        //////
        // needs fixing , create and delete the div is the best option...
        let IntervalId = setInterval(() => {
            if (!($("#liveReportsComponent").length)) {
                clearInterval(IntervalId);
                return;
            }
            updateCanvas(startTime);
        }, 2000);
        scrollDown("#liveReportsComponent");
    });

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // when the about link is clicked 
    $("#aboutLink").on('click',function(){
        // building the about section 
        buildAboutSection();
        // changing color of the links
        changeLinksColor("#aboutLink");
        // changing the bg height
        changeBgHeight(95);
        
        scrollDown("#aboutComponent");
    });
    //when scrolling we wan to change the offset of the navbar
    $(window).on('scroll', () => {
        let offset = window.pageYOffset;
        $(".bg-area").css("background-position-y", offset * 0.6 + "px");
        if ($(this).scrollTop() > 100) {
            $('.scrollToTopBtn').fadeIn();
        } else {
            $('.scrollToTopBtn').fadeOut();
        }
    });
    // when the scroll to the top button is clicked 
    $('.scrollToTop').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

});