Page({
  data: {
    key: '',
    list: [],
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
  searchKey(e) {
    let value = e.detail.value
    this.resetParams()
    this.setData({
      key: value
    })
    this.getList()
  },
  getList() {
    let that = this,
      key = this.data.key
    this.setData({
      loading: true
    })
    wx.request({
      url: 'http://api.shoplooks.com/index.php/m/tuishou/c/product/a/categorylist',
      data: {
        key: key,
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
      }
    })
  },
  onReachBottom() {
    let totalPages = Math.ceil(this.data.total / this.data.pageSize)
    if (this.data.currentPage > totalPages || this.data.total <= this.data.pageSize) {
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