var app = app || {};

app.slidecordion = {
    animate: false,
    state: 'desktop',
    containerCSS: '.sc-container',
    itemCSS: '.sc-item',
    closeCSS: '.close',
    items: undefined,
    activeItem: undefined,
    cnt: 0,             //count of items
    inactiveWidth: 5,   //width of inactive item in percent
    ww: 0,              //window width
    bp: 768,            //breakpoint
    to: undefined,
    tl: new TimelineLite(),

    setMode:function(){
        this.ww = $(window).width();
        if(this.ww >= this.bp){
            this.state = 'desktop';
            $(this.containerCSS).removeClass('mobile').addClass('desktop');
        }
        else{
            this.state = 'mobile';
            $(this.containerCSS).removeClass('desktop').addClass('mobile');
        }
    },

    activeWidth: function(){
        return activeWidth = (100 - (this.inactiveWidth*(this.cnt-1)));
    },

    equalWidth: function(){
        return 100/this.cnt;
    },
    
    setInitialItemWidth: function(items, cnt){
        var w;
        if(this.state === 'desktop'){
            w = this.equalWidth();
        }
        else{
            w = 100;
        }
        for(var i=0; i<cnt; i++){
            TweenLite.set(items[i], {width : w+'%'});
        }  
    },

    activate:function(item){
        var that = this;
        var allItems = $(this.itemCSS);
        var allInitStages = $(this.itemCSS).find('.initStage');
        var allOpenStages = $(this.itemCSS).find('.openStage');
        var allLabels = $(this.itemCSS).find('.label');
        var allOpenStageH2 = $(this.itemCSS).find('.openStage > h2');
        var allOpenStageText = $(this.itemCSS).find('.openStage > .text');
        var $item = $(item);
        var initStage = $item.find('.initStage');
        var openStage = $item.find('.openStage');
        var openLabel = $item.find('.label');
        var openStageH2 = $item.find('.openStage > h2');
        var openStageText = $item.find('.openStage > .text');

        TweenLite.set(allItems.not(item), {className:'-=active'});

        this.activeItem = item;
        this.animate = true;

        //var bgurl = $item.attr('data-bg');

        if(this.state === 'desktop'){
            TweenLite.set($(this.itemCSS), {className:'+=is-open'});
            TweenLite.set(item, {className:'+=active'});

            this.tl
                .to(allInitStages, 0.3, {autoAlpha:0, ease:Power3.easeInOut})
                .to(allInitStages, 0, {height:0, autoAlpha:0})
                .to(allOpenStages, 0.4, {autoAlpha:0, ease:Power3.easeInOut}, "-=0.4")
                .to([allOpenStageH2.not(openStageH2), allOpenStageText.not(openStageText)], 0.4, {top:'10%', ease:Power3.easeInOut}, "-=0.4")
                .to(openLabel, 0.4, {autoAlpha:0, top:'-10%', ease:Power3.easeInOut}, "-=0.3")
                .to(allItems.not(item), 0.6, {width:this.inactiveWidth+'%',ease:Power1.easeInOut})
                .to(item, 0.6, {width:this.activeWidth()+'%',ease:Power1.easeInOut}, "-=0.6")
                .to(openStage, 0.3, {autoAlpha:1})
                //.to($('.bg'), 0.5, {autoAlpha:0}, "-=0.3")
                //.to($('.bg'), 0, {backgroundImage:'url('+ bgurl +')'})
                //.to($('.bg'), 0.5, {autoAlpha:1})
                .to(openStageH2, 0.2, {top:'35px'}, "-=0.3")
                .to(openStageText, 0.3, {top:'75px'}, "-=0.3")
                .to(allLabels.not(openLabel), 0.3, {autoAlpha:1, top:'10%', onComplete:function(){
                    that.animate = false;
                }}, "-=0.3")
        }
        if(this.state === 'mobile'){
            if(!$item.hasClass('active')){
                TweenLite.set(item, {className:'+=active'});
                this.tl
                    .to(openStage, 0, {height:'auto'})
                    .to(allOpenStages.not(openStage), 0.3, {height:0})
                    .from(openStage, 0.3, {height:0}, "-=0.3")
                    .to(openStage, 0.3, {autoAlpha:1, onComplete:function(){
                        that.animate = false;
                    }}, "-=0.1")
            }
            else{
                TweenLite.set(item, {className:'-=active'});
                this.tl.to(openStage, 0.3, {autoAlpha:1, height:0, onComplete:function(){
                    that.animate = false;
                }})
            }      
        }
    },

    deactivate:function(item){
        var that = this;
        var allItems = $(this.itemCSS);
        var allInitStages = $(this.itemCSS).find('.initStage');
        var allOpenStages = $(this.itemCSS).find('.openStage');
        var allLabels = $(this.itemCSS).find('.label');
        var allOpenStageH2 = $(this.itemCSS).find('.openStage > h2');
        var allOpenStageText = $(this.itemCSS).find('.openStage > .text');
        var $item = $(item);
        var initStage = $item.find('.initStage');
        var openStage = $item.find('.openStage');
        var openLabel = $item.find('.label');
        var openStageH2 = $item.find('.openStage > h2');
        var openStageText = $item.find('.openStage > .text');
        
        TweenLite.set(allItems, {className:'-=is-open'});
        
        this.activeItem = undefined;
        this.animate = true;

        this.tl
            //.to($('.bg'), 0.5, {autoAlpha:0})
            .to(allInitStages, 0.3, {autoAlpha:0, height:0, ease:Power3.easeInOut}, "-=0.5")
            .to(allOpenStages, 0.4, {autoAlpha:0, ease:Power3.easeInOut}, "-=0.3")
            .to(allLabels, 0.3, {autoAlpha:0, top:'10%'}, "-=0.3")
            .to(allItems, 0.6, {width:this.equalWidth()+'%', ease:Power1.easeInOut})
            .to(allInitStages, 0, {height:'100%'})
            .to(allInitStages, 0.6, {autoAlpha:1, onComplete:function(){
                that.animate = false;
                TweenLite.set(allItems, {className:'-=active'});
            }}, "-=0.1")
    },

    bindEvents: function(){
        var that = this;

        $(this.itemCSS).on('click', function(e){
            var me = $(this);
            if(!that.animate){
                that.activate(me);  
            }
        });
        
        $(this.closeCSS).on('click', function(e){
            e.stopPropagation();
            if(!that.animate){
                that.deactivate(that.activeItem); 
            }
        });

        $(window).resize(function(){
            clearTimeout(this.to);
            this.to = setTimeout(function(){
                that.init();
            },250);  
        });
    },

    init:function(){

        this.setMode(); 

        var allItems = $(this.itemCSS);
        var allInitStages = $(this.itemCSS).find('.initStage');
        var allOpenStages = $(this.itemCSS).find('.openStage');
        var allLabels = $(this.itemCSS).find('.label');
        var allOpenStageH2 = $(this.itemCSS).find('.openStage > h2');
        var allOpenStageText = $(this.itemCSS).find('.openStage > .text');

        this.tl.kill();
        TweenLite.set($(this.itemCSS), {className:'-=is-open'});
        TweenLite.set(allItems, {className:'-=active'});
        TweenLite.set([allItems, allInitStages, allOpenStages, allLabels, allOpenStageH2, allOpenStageText], {clearProps:'all'});

        this.cnt = $(this.itemCSS).length;
        this.items = $(this.itemCSS);
        this.setInitialItemWidth(this.items, this.cnt);
        this.bindEvents();

    }
};