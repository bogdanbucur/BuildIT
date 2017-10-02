$.fn.pageMe = function(opts){
    let $this = this,
        defaults = {
            perPage: 7,
            showPrevNext: false,
            hidePageNumbers: false
        },
        settings = $.extend(defaults, opts);

    let listElement = $this;
    let perPage = settings.perPage;
    let children = listElement.children();
    let pager = $('.pager');

    if (typeof settings.childSelector !== "undefined") {
        children = listElement.find(settings.childSelector);
    }

    if (typeof settings.pagerSelector !== "undefined") {
        pager = $(settings.pagerSelector);
    }

    let numItems = children.size();
    let numPages = Math.ceil(numItems/perPage);

    pager.data("curr",0);

    if (settings.showPrevNext){
        $('<li><a href="#" class="prev_link">«</a></li>').appendTo(pager);
    }

    let curr = 0;
    while(numPages > curr && (settings.hidePageNumbers === false)){
        $('<li><a href="#" class="page_link">'+(curr+1)+'</a></li>').appendTo(pager);
        curr++;
    }

    if (settings.showPrevNext){
        $('<li><a href="#" class="next_link">»</a></li>').appendTo(pager);
    }

    pager.find('.page_link:first').addClass('active');
    pager.find('.prev_link').hide();
    if (numPages<=1) {
        pager.find('.next_link').hide();
    }
    pager.children().eq(1).addClass("active");

    children.hide();
    children.slice(0, perPage).show();

    pager.find('li .page_link').click(function(){
        let clickedPage = $(this).html().valueOf()-1;
        goTo(clickedPage,perPage);
        return false;
    });
    pager.find('li .prev_link').click(function(){
        previous();
        return false;
    });
    pager.find('li .next_link').click(function(){
        next();
        return false;
    });

    function previous(){
        let goToPage = parseInt(pager.data("curr")) - 1;
        goTo(goToPage);
    }

    function next(){
        goToPage = parseInt(pager.data("curr")) + 1;
        goTo(goToPage);
    }

    function goTo(page){
        let startAt = page * perPage,
            endOn = startAt + perPage;

        children.css('display','none').slice(startAt, endOn).show();

        if (page>=1) {
            pager.find('.prev_link').show();
        }
        else {
            pager.find('.prev_link').hide();
        }

        if (page<(numPages-1)) {
            pager.find('.next_link').show();
        }
        else {
            pager.find('.next_link').hide();
        }

        pager.data("curr",page);
        pager.children().removeClass("active");
        pager.children().eq(page+1).addClass("active");

    }
};

$(document).ready(function(){

    $('#boardsTable').pageMe({pagerSelector:'#boardsPager',showPrevNext:true,hidePageNumbers:false,perPage:5});
    $('#cpuTable').pageMe({pagerSelector:'#cpuPager',showPrevNext:true,hidePageNumbers:false,perPage:5});
    $('#gpuTable').pageMe({pagerSelector:'#gpuPager',showPrevNext:true,hidePageNumbers:false,perPage:5});
    $('#ramTable').pageMe({pagerSelector:'#ramPager',showPrevNext:true,hidePageNumbers:false,perPage:5});
    $('#ssdTable').pageMe({pagerSelector:'#ssdPager',showPrevNext:true,hidePageNumbers:false,perPage:5});
    $('#hddTable').pageMe({pagerSelector:'#hddPager',showPrevNext:true,hidePageNumbers:false,perPage:5});
    $('#powerSupplyTable').pageMe({pagerSelector:'#powerSupplyPager',showPrevNext:true,hidePageNumbers:false,perPage:5});
    $('#casesTable').pageMe({pagerSelector:'#casesPager',showPrevNext:true,hidePageNumbers:false,perPage:5});

});