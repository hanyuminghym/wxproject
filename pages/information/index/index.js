var root_path = "../../../";
var index_obj = require(root_path+'function/information_index.js');
var figure_obj = require(root_path+'function/information_figure.js');
var api = require(root_path+'api/information_api.js');
var menu_static = 0;

const app=getApp();

Page({
  data: {
    hid: false,
    menuStatic:menu_static,
    dis:"display_block",
    imgUrls: [
      root_path+ 'images/pic1.jpeg',
      root_path + 'images/pic2.jpeg',
      root_path + 'images/pic3.jpeg',
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    indicatorDots:true,
    
    // info:[{"author": "作者",
    // "dynasty": "作者朝代",
    // "title": "文章题目",
    // "article": "文章的具体内容",
    // "useless_data": "没什么用的数据，纯粹为了增加数据长度，能更快查看到异常的抛出。",
    // "share_times": 0,
    // "like_times": 0,
    // "id": "0"}]
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh', new Date())
  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        console.log(res, new Date())
      }
    })
  },
  onReady:function(){
      var that = this;
      // setTimeout(function () {
      //     that.setData({ hid: true });
      // }, 2000);
    that.actionsheet = this.selectComponent("#actionsheet");
    console.log(that.actionsheet);
    that.loadInitData();
  },

  showDialog() {
    this.actionsheet.showModal();
  },
  _cancelEvent() {
    console.log('你点击了取消');
    this.actionsheet.hideModal();
  },
  //确认事件
  _confirmEvent() {
    console.log('你点击了确定');
    this.actionsheet.hideModal();
  },


  onShow:function(){
      var that = this;
      setTimeout(function () {
          that.setData({ dis:"display_none" });
      }, 1500);
      

      if(figure_obj.get_figure_cookie()){
          this.setData({ dis:"display_none" });
      }else{
          figure_obj.set_figure_cookie();
      }
  },

  detail: function(event) {
      index_obj.redirectTo_index(event);
  },

  toggleAction: function(event){
      console.log("aaa");
    
  },
 

  click_menu:function(event){
      this.menu_static = event.currentTarget.id;
      this.setData({
         menuStatic:this.menu_static
      });
  },

  //分页查询
  loadInitData: function () {
    var that = this
    var currentPage = 0; // 因为数组下标是从0开始的，所以这里用了0
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: []
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    wx.request({
      url: 'https://raw.githubusercontent.com/lanfeng1993/LoadDataDemo/master/data/data.json',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        var data = res.data; // 接口相应的json数据
        var articles = data.data; // 接口中的data对应了一个数组，这里取名为 articles
        var totalDataCount = articles.length;

        console.log(articles);
        console.log("totalDataCount:" + totalDataCount);
        console.log("currentPage:" + currentPage);
        that.setData({
          // ["dataArray[" + currentPage + "]"]: articles,
          articles: articles,
          currentPage: currentPage,
          totalDataCount: totalDataCount
        })
      }
    })

  },
  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "加载第" + (currentPage + 1) + "页";
    console.log("load page " + (currentPage + 1));
    wx.showLoading({
      title: tips,
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    wx.request({
      url: 'https://raw.githubusercontent.com/lanfeng1993/LoadDataDemo/master/data/data.json',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        console.log(data);
        var data = res.data; // 接口相应的json数据
        console.log(data);
        var articles = data.data; // 接口中的data对应了一个数组，这里取名为 articles

        // 将新一页的数据添加到原数据后面
        var originArticles = that.data.articles;
        var newArticles = originArticles.concat(articles);
        console.log(newArticles);
        that.setData({
          articles: newArticles,
          currentPage: currentPage
        })
      }
    })
  }
  
});


