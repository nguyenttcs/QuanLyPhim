/**
    Yêu cầu 1: Đọc file dữ liệu từ menu.json, lưu vào 1 biến mảng (Hoặc prototype)
 */

var mangTongDanhMucPhim = [];
var modalMaDMPhimHienTai = ''; //Lay maDMPhim khi click vao Menu Item
var inDexMaDMPhimHienTai = ''; //Lay index cua maDMPhim khi click vao Menu Item

//Goi ajax doc file json
$.ajax({
    url: './Data/menu.json',
    type: 'GET'
}).done(function (result) {
    for (var i = 0; i < result.length; i++) {
        var maDanhMucPhim = result[i].maDanhMucPhim;
        var tenDanhMucPhim = result[i].tenDanhMucPhim;
        var danhMucPhim = result[i].DanhMucPhim;
        var tongDanhMucPhim = new TongDanhMucPhim(maDanhMucPhim, tenDanhMucPhim);

        for (var j = 0; j < danhMucPhim.length; j++) {
            var maPhim = danhMucPhim[j].ma;
            var tenPhim = danhMucPhim[j].ten;
            var danhMucPhimPrototype = new DanhMucPhim(maPhim, tenPhim);
            tongDanhMucPhim.themVaoDanhMucPhim(danhMucPhimPrototype);
        }
        mangTongDanhMucPhim.push(tongDanhMucPhim);

    }

    //Sau khi load du lieu tu ajax done -> tien hanh load du lieu len menu va table
    loadDuLieuLenMenuVaTable();

    //Mac dinh nut Them danh muc hien thi
    setShowButton('btnThemDanhMuc', 'block', 'btnLuu', 'none');

}).fail(function (error) {
    console.log(error);
})

// console.log(mangTongDanhMucPhim);

/**
 * Yêu cầu 2: Dựa vào mảng và giao diện có sẵn tổ chức hàm để load menu đa cấp như sau
  -TheLoai
    +Phim kiếm hiệp
    +Phim hành động
    ...
  -PhimLe
    +Phim lẻ 2017
    ...
  -PhimBo
    ...
  -PhimChieuRap
    ...
 */

//Load du lieu len Menu va Main Table
function loadDuLieuLenMenuVaTable() {
    //Reset data base html
    document.getElementsByClassName('primary')[0].innerHTML = '';
    document.getElementById('tblDanhMucPhim').innerHTML = '';

    var liContent = '';
    var trContent = '';
    for (var i = 0; i < mangTongDanhMucPhim.length; i++) {
        var liChildContent = '';
        for (var j = 0; j < mangTongDanhMucPhim[i].listDanhMucPhim.length; j++) {
            liChildContent += `
                <li><a href="">${mangTongDanhMucPhim[i].listDanhMucPhim[j].ten}</a></li>
            `;
        }
        liContent += `
            <li>
                <a href="">${mangTongDanhMucPhim[i].tenDanhMucPhim}</a>
                <ul class="sub">
                    ${liChildContent}
                </ul>
            </li>
        `;

        trContent += `
            <tr>
                <td>${mangTongDanhMucPhim[i].maDanhMucPhim}</td>
                <td>${mangTongDanhMucPhim[i].tenDanhMucPhim}</td>
                <td>
                    <button class="btn btn-success" onClick=suaTongDMPhim('${i}')>Sửa</button>
                    <button class="btn btn-danger" onClick=xoaTongDMPhim('${i}')>Xóa</button>
                    <button class="btn btn-success" data-toggle="modal" data-target="#modelId" onClick=menuItem('${mangTongDanhMucPhim[i].maDanhMucPhim}')>Menu Item</button>            
                </td>
            </tr>
        `;
    }
    //Load data to menu
    document.getElementsByClassName('primary')[0].innerHTML = liContent;
    document.getElementById('tblDanhMucPhim').innerHTML = trContent;

}

//Load du lieu len Menu Item
function menuItem(maDMPhim) {
    //default chi hien thi nut Them danh muc con
    setShowButton('btnThemDanhMucCon', 'block', 'btnCapNhatDanhMucCon', 'none');



    //reset data danh muc con
    document.getElementsByClassName('modal-title')[0].innerHTML = '';
    document.getElementById('tblDanhMucPhimCon').innerHTML = '';

    var modalTitle = '';
    var inDexMaDMPhim;
    var trDMConContent = '';
    for (var i = 0; i < mangTongDanhMucPhim.length; i++) {
        if (mangTongDanhMucPhim[i].maDanhMucPhim === maDMPhim) {
            inDexMaDMPhim = i;
            modalTitle = mangTongDanhMucPhim[i].tenDanhMucPhim;
            break;
        }
    }
    for (var j = 0; j < mangTongDanhMucPhim[inDexMaDMPhim].listDanhMucPhim.length; j++) {
        trDMConContent += `
            <tr>
                <td>${mangTongDanhMucPhim[inDexMaDMPhim].listDanhMucPhim[j].ma}</td>
                <td>${mangTongDanhMucPhim[inDexMaDMPhim].listDanhMucPhim[j].ten}</td>
                <td>
                    <button class="btn btn-success" onClick=suaPhim('${j}')>Sửa</button>
                    <button class="btn btn-danger" onClick=xoaPhim('${j}')>Xóa</button>
                </td>
            </tr>
        `;
    }
    //Modal Title Danh muc phim
    document.getElementsByClassName('modal-title')[0].innerHTML = `Danh mục ${modalTitle}`;

    //Noi dung
    document.getElementById('tblDanhMucPhimCon').innerHTML = trDMConContent;

    // Cap nhat bien toan cuc de su dung cho function them DM Phim Con
    modalMaDMPhimHienTai = maDMPhim;
    inDexMaDMPhimHienTai = inDexMaDMPhim;



    // Moi lan click Menu Item se reset Form
    resetGiaoDienDMPhim('ma', 'ten');
}

/**
 * Yêu cầu 3(*): 
  +Xây dựng các input thực hiện các chức năng thêm xóa sửa trên mảng menu,(và menu con)
  +Viết phương thức tạo bảng quản lý menu bên dưới (Bảng để quản lý menu)
  +Viết phương thức tạo lại menu theo mảng (Phía trên, cũng tương tự tạo table thì ta tạo ra các ul li) 
  Tóm lại: Sau các nghiệp vụ thêm xóa sửa => Render lại menu và cả table
  +Check validation cho các trường input (Kiểm tra rổng)
 */

// Function Them 1 Danh Muc Cha
document.getElementById('btnThemDanhMuc').addEventListener('click', function () {
    var maDM = document.getElementById('MaDanhMuc').value;
    var tenDM = document.getElementById('TenDanhMuc').value;

    //Kiem tra input nhap vao != rong
    if (kiemTraRong(maDM) || kiemTraRong(tenDM)) {
        alert("Vui long nhap day du thong tin truoc khi Submit!");
        return;
    }

    var tongDMPhim = new TongDanhMucPhim(maDM, tenDM);
    mangTongDanhMucPhim.push(tongDMPhim);

    loadDuLieuLenMenuVaTable();
    resetGiaoDienDMPhim('MaDanhMuc', 'TenDanhMuc');
})

// Function Them Danh Muc Phim Con
document.getElementById('btnThemDanhMucCon').addEventListener('click', function () {
    var maPhim = document.getElementById('ma').value;
    var tenPhim = document.getElementById('ten').value;

    //Kiem tra input nhap vao != rong
    if (kiemTraRong(maPhim) || kiemTraRong(tenPhim)) {
        alert("Vui long nhap day du thong tin truoc khi Submit!");
        return;
    }

    var danhMucPhim = new DanhMucPhim(maPhim, tenPhim);
    mangTongDanhMucPhim[inDexMaDMPhimHienTai].themVaoDanhMucPhim(danhMucPhim);

    //Load lai Menu Danh Muc Phim Con va cap nhat Menu o trang chu
    menuItem(modalMaDMPhimHienTai);
    loadDuLieuLenMenuVaTable();
})

// Function Sua Tong DM Phim
function suaTongDMPhim(index) {
    //Sau khi Click nut Sua thi Nut Cap Nhat hien thi
    setShowButton('btnThemDanhMuc', 'none', 'btnLuu', 'block');

    //Load data len giao dien Cap nhat danh muc
    document.getElementById('MaDanhMuc').value = mangTongDanhMucPhim[index].maDanhMucPhim;
    document.getElementById('TenDanhMuc').value = mangTongDanhMucPhim[index].tenDanhMucPhim;

    //Add attr disabled for Ma Danh Muc
    document.getElementById('MaDanhMuc').setAttribute('disabled', 'disabled');

    document.getElementById('btnLuu').onclick = function () {
        //Cap nhat lai data nguoi dung vua sua
        var newTenDMPhim = document.getElementById('TenDanhMuc').value;
        mangTongDanhMucPhim[index].tenDanhMucPhim = newTenDMPhim;

        //Kiem tra input nhap vao != rong
        if (kiemTraRong(newTenDMPhim)) {
            alert("Vui long nhap day du thong tin truoc khi Submit!");
            return;
        }

        loadDuLieuLenMenuVaTable();
        resetGiaoDienDMPhim('MaDanhMuc', 'TenDanhMuc');
        //Reset button
        setShowButton('btnThemDanhMuc', 'block', 'btnLuu', 'none');

    }
}

// Function Sua Phim - Danh muc Con
function suaPhim(indexCon) {
    // Khi bam nut Sua thi btn Them an di, btn Cap nhat hien thi
    setShowButton('btnThemDanhMucCon', 'none', 'btnCapNhatDanhMucCon', 'block');

    //Load data len giao dien Cap nhat danh muc
    document.getElementById('ma').value = mangTongDanhMucPhim[inDexMaDMPhimHienTai].listDanhMucPhim[indexCon].ma;
    document.getElementById('ten').value = mangTongDanhMucPhim[inDexMaDMPhimHienTai].listDanhMucPhim[indexCon].ten;

    //Add attr disabled for Ma Danh Muc
    document.getElementById('ma').setAttribute('disabled', 'disabled');

    document.getElementById('btnCapNhatDanhMucCon').onclick = function () {
        //Cap nhat lai data nguoi dung vua sua
        var newTenPhim = document.getElementById('ten').value
        mangTongDanhMucPhim[inDexMaDMPhimHienTai].listDanhMucPhim[indexCon].ten = newTenPhim;

        //Kiem tra input nhap vao != rong
        if (kiemTraRong(newTenPhim)) {
            alert("Vui long nhap day du thong tin truoc khi Submit!");
            return;
        }
        
        loadDuLieuLenMenuVaTable();
        menuItem(modalMaDMPhimHienTai);
        resetGiaoDienDMPhim('ma', 'ten');
        //Reset btn
        setShowButton('btnThemDanhMucCon', 'block', 'btnCapNhatDanhMucCon', 'none');
    }
}

//reset giao dien
function resetGiaoDienDMPhim(ma, ten) {
    //Reset
    document.getElementById(ma).value = '';
    document.getElementById(ten).value = '';

    //Add attr disabled for Ma Danh Muc
    document.getElementById(ma).removeAttribute('disabled');
}

//Function Xoa Tong DM Phim
function xoaTongDMPhim(index) {
    mangTongDanhMucPhim.splice(index, 1);
    loadDuLieuLenMenuVaTable();
}

//function Xoa Phim - Danh muc Con
function xoaPhim(indexCon) {
    mangTongDanhMucPhim[inDexMaDMPhimHienTai].xoaKhoiDanhMucPhim(indexCon);
    loadDuLieuLenMenuVaTable();
    menuItem(modalMaDMPhimHienTai);
}

/**
 * 
 * @param {id cua btn Them} id1 
 * @param {block or none} ds1 
 * @param {id cua btn Cap Nhat} id2 
 * @param {none or block} ds2 
 */
function setShowButton(id1, ds1, id2, ds2) {
    //Hidden CapNhat button
    document.getElementById(id1).style.display = ds1;
    document.getElementById(id2).style.display = ds2;
}

//Validate mandatory field
function kiemTraRong(value) {
    if (value === '') {
        return true;
    }
    return false;
}



