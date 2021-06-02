"use strict";
// The script includes functions for building the about page.

function buildAboutSection() {
    $(".sections").empty();

    // we create the div that contains the canvas and then the canvas div
    const liveReportsComponent = `
        <div id="aboutComponent">
            <div class="profile-img">
                <img src="https://github.com/Mohamab29/Cryptonite/blob/main/assets/images/myprofile.jpg">
            </div>
            <div class="about-card">
                <div class="about-me">
                    <h2>
                        About me 👨🏻‍💻:
                    </h2>
                    <p>
                        I am a 24-year-old software Engineer from Baqa al-Gharbiyye, 
                        finished my B.Sc. in Sami Shamoon College of Engineering.<br>
                        Currently learning full-stack development and have a 2-years experience in the field of Machine Learning and python. 
                    </p>
                    <p>
                        <h2>Things I love to do 💁🏻‍♂️:</h2>
                        <ul>
                            <li>Look at Memes 🐸</li>
                            <li>Writing code 💻</li>
                            <li>Listening to music 🎶</li> 
                            <li>Watch Anime 👓</li>
                            <li>Chill with friends 🍁</li>
                        </ul>
                    </p>
                </div>
                <div class="about-the-project">
                    <h2>
                        About the website 📊:
                    </h2>
                    <p>
                    The website shows the top 100 cryptocurrencies , price information about each currency and a live report of price changes of up to five chosen currencies.<br><br>
                    ⁕ <b>The first page</b> displays cards of the top 100 cryptocurrencies sorted by market cap,<br>
                    and each card contains a switch button (If checked then it will be shown in live reports page),<br>
                    and more info button which when clicked shows the logo and the price of a currency in USD,EUR,ILS,<br>
                    also the page has a search bar that you can use to search for a currency by typing the symbol, e.g.: ETH, BTC ... <br><br>
                    ⁕ <b>The second page</b> will display the price of checked currencies from the first page every two seconds,<br>
                    and displays them in a linear graph where the y-axis is the price and the x-axis is the seconds that have passed since you entered the page,<br>
                    additionally you can export the graph and if you click on the legends then you can see each currency’s graph separately.<br><br>
                    ⁕ <b>The about page</b> is self-explanatory 🙄.

                    </p>
                </div>
                <div class="contact-buttons">
                    <h3>
                    Contact me 📝 
                    </h3>
                    <br>
                    <a class="btn btn-primary" style="background-color: #333333 !important;" href="https://github.com/Mohamab29" target="_blank" role="button">
                        <i class="fab fa-github"></i>
                    </a>	
                    <a class="btn btn-primary" style="background-color: #0082ca !important;" href="https://www.linkedin.com/in/mohamed-abomokh/" target="_blank" role="button">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a class="btn btn-primary" style="background-color: #ac2bac !important;" href="https://www.instagram.com/mohamed097/" target="_blank" role="button">
                        <i class="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
        </div>
    `;

    // we append the component to sections div
    $(".sections").append(liveReportsComponent);

}