Page({
  data: {
    scrollLeft: 0,
    cataId: 1,
    list: [],
    navItem: [{
      id: 1,
      text: '美妆个护'
    }, {
      id: 2,
      text: '食品保健'
    }, {
      id: 3,
      text: '服装鞋包'
    }, {
      id: 4,
      text: '母婴玩具'
    }, {
      id: 5,
      text: '钟表饰品'
    }, {
      id: 6,
      text: '户外运动'
    }, {
      id: 7,
      text: '电子电器'
    }, {
      id: 8,
      text: '家居生活'
    }],
    currentPage: 1,
    total: 1,
    pageSize: 20,
    empty: false,
    loading: false,
    more: true
  },
  onLoad() {
    this.getList()
  },
  resetParams() {
    this.data.currentPage = 1
    this.data.total = 1
    this.data.empty = false
    this.data.more = true
    this.data.list = []
  },
  changeCata(e) {
    let cataId = e.target.dataset.id,
      left = e.detail.x - 50
    this.setData({
      scrollLeft: left,
      cataId: cataId
    })
    this.resetParams()
    this.getList()
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
  },
  getList() {
    let that = this,
      cataId = this.data.cataId
    this.setData({
      loading: true
    })
    wx.showLoading({
      title: '正在加载中...'
    })
    wx.request({
      url: 'http://api.shoplooks.com/index.php/m/tuishou/c/product/a/categorylist',
      data: {
        categoryId: cataId,
        page: that.data.currentPage,
        pageSize: 10
      },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        let payload = res.data.payload,
          listProd = payload.products,
          listArray = that.data.list.concat(listProd)
        if (payload && listProd.length) {
          that.setData({
            list: listArray,
            total: payload.total,
            loading: false
          })
        } else {
          that.setData({
            empty: true,
            loading: false
          })
        }
        if (this.data.total <= this.data.pageSize) {
          this.setData({
            more: false
          })
        }
        wx.hideLoading()
      }
    })
  },
  onReachBottom() {
    let totalPages = Math.ceil(this.data.total / this.data.pageSize)
    if (this.data.currentPage > totalPages) {
      this.setData({
        more: false
      })
      return
    } else {
      this.data.currentPage++
      this.getList()
    }
  }
});