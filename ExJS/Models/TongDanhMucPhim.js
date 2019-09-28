function TongDanhMucPhim(_maDMPhim, _tenDMPhim) {
    this.listDanhMucPhim = [];
    this.maDanhMucPhim = _maDMPhim;
    this.tenDanhMucPhim = _tenDMPhim;

    this.themVaoDanhMucPhim = function (danhMucPhim) {
        this.listDanhMucPhim.push(danhMucPhim);
    }

    this.xoaKhoiDanhMucPhim = function (indexDanhMucPhim) {
        this.listDanhMucPhim.splice(indexDanhMucPhim, 1);
    }
}