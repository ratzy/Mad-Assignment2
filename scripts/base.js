var filterTerm;
var currentURL = window.location.href;
var winHeight = $(window).height();
var searchKeyword = 'adobe';
var curDay = new Date(); //Current Date
var rangeEnd;


$(document).ready(function () {
    checkFromUrl();
    lazyLoading();
    search();
});

/*START: Check URL for keywords*/

function checkFromUrl() {
    if (currentURL.split("=")[1] == "") {
        filterTerm = 'adobe';
        rangeEnd = rangeStart + 4;
        getData(rangeEnd);
        return;
    }
    if (currentURL.indexOf("xd") >= 0) {
        filterTerm = 'xd';
        getData(rangeEnd);
        return;
    }
    if (currentURL.indexOf("photoshop") >= 0) {
        filterTerm = 'photoshop';
        getData(rangeEnd);
        return;
    }
}
/*END: Check URL for keywords*/

/*START: Show Loader*/
function showLoader() {
    $('.loader').removeClass('hide');
}
/*End: Show Loader*/

/*START: Hide Loader*/
function hideLoader() {
    $('.loader').addClass('hide');
}
/*End: Hide Loader*/

var returnData, totalTweet;
/*START: Fetch Data*/
function getData(rangeEnd) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://aravindtwitter.herokuapp.com/twittersearch?key=adobe";

    $.ajax({
        url: proxyurl + url,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json'
    }).pipe(
        function (returnData) {
            console.log(returnData);
            totalTweet = returnData.statuses.length;
            setTimeout(function () {
                hideLoader();
                if (rangeEnd === undefined) {
                    populateData(returnData, rangeEnd, filterTerm);
                } else {
                    populateData(returnData, rangeEnd, filterTerm);
                }
            }, 200);
        },
        function (jqXHR, textStatus, errorThrown) {}
    );
}
/*END: Fetch Data*/

/*START: Populate Data*/
var rangeStart = 0;

function populateData(returnData, rangeEnd) {
    var price, discount, finalPrice;
    //    +returnData[i].img_url +
    //    (rangeStart + 4)
    if (rangeEnd === undefined) {
        rangeEnd = returnData.statuses.length;
    }
    for (var i = rangeStart; i <= rangeEnd; i++) {
        if (i < totalTweet) {
            var tweetCreated = returnData.statuses[i].created_at;

            //Calculating time 
            var tweetTime = timeDiff(curDay, tweetCreated);

            populateTweets(returnData, i, tweetTime, filterTerm);
        }
    }
    //    filter(filterTerm);
}

/*END: Populate Data*/

/*START: Populate Tweets into DOM*/
function populateTweets(returnData, i, tweetTime) {
    //Populating Teweets
    $('.tweet-list').append('<li class="tweet-item flex-wrapper"><div class="tooltip-wrapper tweet-user-info"><div class="tooltip-info"><img class="profile-img" src="' + returnData.statuses[i].user.profile_image_url_https + '" alt="' + returnData.statuses[i].user.screen_name + '" /></div><div class="tooltip-content rel-wrapper"><div class="rel-wrapper"><div class="tooltip-content-header flex-wrapper"><img class="profile-img" src="' + returnData.statuses[i].user.profile_image_url_https + '" alt="' + returnData.statuses[i].user.screen_name + '"  /><button class="btn secondary-btn" type="btn">Follow</button></div><div class="tooltip-content-body"><div class="user-name-block"><h3 class="user-name">' + returnData.statuses[i].user.name + '</h3><h5 class="user-handle">@' + returnData.statuses[i].user.screen_name + '</h5></div><p class="user-bio">' + returnData.statuses[i].user.description + '</p><div class="user-follow-wrapper flex-wrapper"><span class="user-follow-ietm"><em>' + returnData.statuses[i].user.friends_count + '</em> Following</span><span class="user-follow-ietm"><em>' + returnData.statuses[i].user.followers_count + '</em> Followers</span></div></div></div></div></div><div class="tweet-content-info"><div class="tweet-info-wrapper"><div class="flex-wrapper flex-align-center"><div class="user-name-block"><h3 class="user-name">' + returnData.statuses[i].user.name + '</h3><h5 class="user-handle">@' + returnData.statuses[i].user.screen_name + '</h5></div><span class="tweet-time">' + tweetTime + '</span></div><div class="tweet-content"><p class="tweet-msg">' + returnData.statuses[i].text + '</p><img class="tweet-img" src="" alt="" /></div></div><div class="tweet-respond-wrapper flex-wrapper"><span class="tweet-respond-item tweet-comment"><i class="far fa-comment"></i> <em></em></span><span class="tweet-respond-item tweet-retweet"><i class="fas fa-retweet"></i> <em></em></span><span class="tweet-respond-item tweet-like"><i class="far fa-heart"></i> <em></em></span><span class="tweet-respond-item tweet-share"><i class="far fa-share-square"></i> <em></em></span></div></div></li>');
}
/*END: Populate Tweets into DOM*/

/*START: Calculate Time*/
function timeDiff(curDay, tweetCreated) {
    var tweetDate = new Date(tweetCreated);
    var diff = curDay.valueOf() - tweetDate.valueOf();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    if (hours > 0) {
        if (hours >= 24) {
            hours = parseInt((hours / 24));
            return hours + "day";
        } else {
            return hours + "h " + minutes + "m";
        }
    } else {
        return minutes + "m";
    }
}

/*END: Calculate Time*/

/*START: Lazy Loading*/
function lazyLoading() {
    var ele, docHeight, scrollTop;
    $(window).scroll(function (e) {
        docHeight = $(document).height();
        scrollTop = $(window).scrollTop() + $(window).height();
        //Works only when its not in cart view
        if ($('.tweet-list .tweet-item').length < (totalTweet - 1)) {
            if (scrollTop >= docHeight) {
                rangeStart = $('.tweet-list .tweet-item').length;
                rangeEnd = rangeStart + 4;
                showLoader();
                setTimeout(function () {
                    getData(rangeStart, rangeEnd);
                }, 200);
            }
        }
    });

}

/*END: Lazy Loading*/

/*START: Search*/
function search() {
    $(document).on('keyup', '.search-wrapper .form-input', function () {
        filterTerm = $(this).val().toUpperCase();
        filter(filterTerm);
    })
}
/*END: Search*/

/*START: Search*/
function filter(filterTerm) {
    var targetText, txtValue;
    if (filterTerm.length >= 1) {
        for (var i = 0; i < $('.tweet-list .tweet-item').length; i++) {
            targetText = $('.tweet-list .tweet-item:nth-child(' + (i + 1) + ') .tweet-msg')[0];
            txtValue = targetText.textContent || targetText.innerText;
            if (txtValue.toUpperCase().indexOf(filterTerm) > -1) {
                $('.tweet-list .tweet-item:nth-child(' + (i + 1) + ')').removeClass('hide').show();
            } else {
                $('.tweet-list .tweet-item:nth-child(' + (i + 1) + ')').addClass('hide').hide();
            }
        }
        setTimeout(function () {
            if ($('.tweet-list .tweet-item.show').length <= 0) {
                showNotFound(); //Showing No Found Result
            }
        }, 200);

    } else {
        $('.tweet-list .tweet-item').removeClass('hide').show();
        hideNotFound();
    }
}
/*END: Search*/

/*START: Clear Search*/
function clearSearch() {
    hideNotFound();
    $('.search-wrapper .form-input').val('');
    $('.tweet-list .tweet-item').removeClass('hide').show();
}
/*END: Clear Search*/

/*START: No Result Found*/
function showNotFound() {
    $('.not-found-wrapper').fadeIn().show();
}
/*END: No Result Found*/
/*START: No Result Found*/
function hideNotFound() {
    $('.not-found-wrapper').fadeOut().hide();
}
/*END: No Result Found*/
