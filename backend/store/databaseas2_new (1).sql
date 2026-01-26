-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jan 25, 2026 at 05:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `databaseas2_new`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_DeleteSanPham` (IN `p_ProductID` INT)   BEGIN
    IF NOT EXISTS (SELECT 1 FROM sanpham WHERE ProductID = p_ProductID) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Không tìm thấy sản phẩm để xóa!';
    END IF;

    IF EXISTS (SELECT 1 FROM order_details WHERE ProductID = p_ProductID) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Không thể xóa vì sản phẩm đã có trong đơn hàng!';
    END IF;

    DELETE FROM sanpham WHERE ProductID = p_ProductID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_InsertSanPham` (IN `p_HinhAnh` VARCHAR(255), IN `p_TenSanPham` VARCHAR(150), IN `p_MoTa` TEXT, IN `p_Gia` DECIMAL(15,2), IN `p_SoLuongTon` INT, IN `p_MaLoai` INT)   BEGIN
    DECLARE new_id INT;
    
    -- Insert vào sanpham
    INSERT INTO sanpham (HinhAnh, TenSanPham, MoTa, Gia, SoLuongTon, MaLoai)
    VALUES (p_HinhAnh, p_TenSanPham, p_MoTa, p_Gia, p_SoLuongTon, p_MaLoai);
    
    SET new_id = LAST_INSERT_ID();
    
    -- TỰ ĐỘNG GÁN ADMIN (ID=1) LÀM NGƯỜI BÁN
    INSERT INTO danglen (ProductID, SellerID, NgayDang)
    VALUES (new_id, 1, NOW())
    ON DUPLICATE KEY UPDATE SellerID = 1;
    
    SELECT new_id AS ProductID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ListSanPhamTheoLoai` (IN `p_MaLoai` INT)   BEGIN
    SELECT s.ProductID, s.TenSanPham, s.Gia, l.TenLoai
    FROM sanpham s
    JOIN loaisanpham l ON s.MaLoai = l.MaLoai
    WHERE s.MaLoai = p_MaLoai
    ORDER BY s.Gia DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ThongKeBanHang` (IN `p_MinDoanhThu` DECIMAL(15,2))   BEGIN
    SELECT s.ProductID, s.TenSanPham,
           SUM(od.Quantity * s.Gia) AS DoanhThu
    FROM sanpham s
    JOIN order_details od ON s.ProductID = od.ProductID
    GROUP BY s.ProductID, s.TenSanPham
    HAVING DoanhThu >= p_MinDoanhThu
    ORDER BY DoanhThu DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_UpdateSanPham` (IN `p_ProductID` INT, IN `p_TenSanPham` VARCHAR(150), IN `p_MoTa` TEXT, IN `p_Gia` DECIMAL(15,2), IN `p_SoLuongTon` INT, IN `p_MaLoai` INT)   BEGIN
    IF NOT EXISTS (SELECT 1 FROM sanpham WHERE ProductID = p_ProductID) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Sản phẩm không tồn tại!';
    END IF;

    IF p_Gia <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Giá sản phẩm phải lớn hơn 0!';
    END IF;

    IF p_SoLuongTon < 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Số lượng tồn không được âm!';
    END IF;

    UPDATE sanpham
    SET TenSanPham = p_TenSanPham,
        MoTa = p_MoTa,
        Gia = p_Gia,
        SoLuongTon = p_SoLuongTon,
        MaLoai = p_MaLoai
    WHERE ProductID = p_ProductID;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `role_admin` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `role_admin`) VALUES
(21, 'Quan Tri He Thong'),
(22, 'Admin San Pham'),
(23, 'Admin Don Hang'),
(24, 'Admin Ho Tro'),
(25, 'Admin Bao Cao');

--
-- Triggers `admin`
--
DELIMITER $$
CREATE TRIGGER `trg_disjoint_before_insert_admin` BEFORE INSERT ON `admin` FOR EACH ROW BEGIN
    IF EXISTS (SELECT 1 FROM nguoimua WHERE id = NEW.id)
       OR EXISTS (SELECT 1 FROM nguoiban WHERE id = NEW.id) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Một người không thể có nhiều vai trò cùng lúc!';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `danglen`
--

CREATE TABLE `danglen` (
  `ProductID` int(11) NOT NULL,
  `SellerID` int(11) NOT NULL,
  `NgayDang` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `danglen`
--

INSERT INTO `danglen` (`ProductID`, `SellerID`, `NgayDang`) VALUES
(6, 6, '2025-12-05 12:30:44'),
(9, 8, '2025-12-06 05:40:33'),
(11, 10, '2025-12-06 05:42:48'),
(18, 1, '2025-12-06 15:05:30'),
(19, 1, '2025-12-06 15:05:56'),
(20, 1, '2025-12-06 15:06:10'),
(29, 15, '2025-12-06 10:14:22'),
(31, 6, '2025-12-07 06:17:24');

--
-- Triggers `danglen`
--
DELIMITER $$
CREATE TRIGGER `trg_check_stock_before_post` BEFORE INSERT ON `danglen` FOR EACH ROW BEGIN
    DECLARE stock INT;
    SELECT SoLuongTon INTO stock FROM sanpham WHERE ProductID = NEW.ProductID;
    
    IF stock <= 0 THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Không thể đăng bán sản phẩm đã hết hàng!';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donhang`
--

CREATE TABLE `donhang` (
  `OrderID` int(11) NOT NULL,
  `NgayDat` datetime NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `PhuongThucThanhToan` varchar(50) NOT NULL,
  `TrangThaiDonHang` varchar(50) NOT NULL,
  `BuyerID` int(11) NOT NULL,
  `SellerID` int(11) NOT NULL,
  `TongTien` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donhang`
--

INSERT INTO `donhang` (`OrderID`, `NgayDat`, `SoLuong`, `PhuongThucThanhToan`, `TrangThaiDonHang`, `BuyerID`, `SellerID`, `TongTien`) VALUES
(2, '2025-12-08 10:35:49', 3, 'COD', 'Chờ thanh toán', 11, 1, 31000000.00),
(3, '2025-12-08 10:37:17', 3, 'COD', 'Chờ thanh toán', 11, 8, 25722222.00),
(4, '2025-12-09 14:36:06', 2, 'COD', 'Chờ thanh toán', 5, 8, 6722222.00),
(5, '2025-12-09 14:36:33', 3, 'COD', 'Chờ thanh toán', 5, 1, 13444444.00),
(6, '2025-12-09 14:42:59', 2, 'COD', 'Chờ thanh toán', 13, 1, 26500000.00);

--
-- Triggers `donhang`
--
DELIMITER $$
CREATE TRIGGER `trg_order_status_sequence` BEFORE UPDATE ON `donhang` FOR EACH ROW BEGIN
    IF (OLD.TrangThaiDonHang = 'Cho xu ly' AND NEW.TrangThaiDonHang NOT IN ('Dang giao', 'Cho xu ly'))
       OR (OLD.TrangThaiDonHang = 'Dang giao' AND NEW.TrangThaiDonHang NOT IN ('Da giao', 'Dang giao'))
       OR (OLD.TrangThaiDonHang = 'Da giao' AND NEW.TrangThaiDonHang NOT IN ('Hoan thanh', 'Da giao'))
    THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Chuyển trạng thái đơn hàng không hợp lệ!';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `giaodich`
--

CREATE TABLE `giaodich` (
  `OrderID` int(11) NOT NULL,
  `BuyerID` int(11) NOT NULL,
  `SellerID` int(11) NOT NULL,
  `DiemTichLuy` int(11) DEFAULT 0,
  `PhanHoiDanhGia` text DEFAULT NULL,
  `ThoiGianNhanHangDuKien` datetime DEFAULT NULL,
  `ThoiGianNhanHangThucTe` datetime DEFAULT NULL,
  `TrangThaiGiaoDich` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `giaodich`
--

INSERT INTO `giaodich` (`OrderID`, `BuyerID`, `SellerID`, `DiemTichLuy`, `PhanHoiDanhGia`, `ThoiGianNhanHangDuKien`, `ThoiGianNhanHangThucTe`, `TrangThaiGiaoDich`) VALUES
(2, 11, 1, 10, 'Sản phẩm tốt, giao nhanh.', '2025-01-10 00:00:00', '2025-01-09 00:00:00', 'Hoàn thành'),
(3, 11, 8, 5, 'Đúng mô tả, hơi chậm 1 chút.', '2025-01-12 00:00:00', '2025-01-13 00:00:00', 'Hoàn thành'),
(4, 5, 8, 8, NULL, '2025-01-15 00:00:00', NULL, 'Đang giao'),
(5, 5, 1, 0, NULL, '2025-01-20 00:00:00', NULL, 'Chờ xác nhận'),
(6, 13, 1, 12, 'Rất hài lòng, đóng gói đẹp.', '2025-01-18 00:00:00', '2025-01-18 00:00:00', 'Hoàn thành');

--
-- Triggers `giaodich`
--
DELIMITER $$
CREATE TRIGGER `trg_check_delivery_time` BEFORE UPDATE ON `giaodich` FOR EACH ROW BEGIN
    IF NEW.ThoiGianNhanHangThucTe IS NOT NULL THEN
        IF NEW.ThoiGianNhanHangThucTe > DATE_ADD(NEW.ThoiGianNhanHangDuKien, INTERVAL 3 DAY) THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Thời gian nhận thực tế không được vượt quá 3 ngày so với dự kiến.';
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_reward_points` AFTER UPDATE ON `giaodich` FOR EACH ROW BEGIN
    IF NEW.TrangThaiGiaoDich = 'Hoàn tất'
       AND OLD.TrangThaiGiaoDich <> 'Hoàn tất' THEN

        UPDATE rankuser
        SET diem_hien_co = diem_hien_co + 
            (SELECT TongTien * 0.01 FROM donhang WHERE OrderID = NEW.OrderID)
        WHERE id = NEW.BuyerID;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `giohang`
--

CREATE TABLE `giohang` (
  `id` int(11) NOT NULL,
  `ten_gio_hang` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `giohang`
--

INSERT INTO `giohang` (`id`, `ten_gio_hang`) VALUES
(5, 'default'),
(7, 'default'),
(11, 'default'),
(12, 'default'),
(13, 'default');

-- --------------------------------------------------------

--
-- Table structure for table `giohang_sanpham`
--

CREATE TABLE `giohang_sanpham` (
  `ProductID` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `ten_gio_hang` varchar(100) NOT NULL,
  `SoLuong` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `giohang_sanpham`
--

INSERT INTO `giohang_sanpham` (`ProductID`, `id`, `ten_gio_hang`, `SoLuong`) VALUES
(18, 11, 'default', 1),
(19, 5, 'default', 1),
(20, 5, 'default', 1),
(20, 11, 'default', 1),
(29, 7, 'default', 1),
(29, 12, 'default', 3),
(31, 7, 'default', 1);

--
-- Triggers `giohang_sanpham`
--
DELIMITER $$
CREATE TRIGGER `trg_cart_add_check_stock` BEFORE INSERT ON `giohang_sanpham` FOR EACH ROW BEGIN
    DECLARE stock INT;
    
    SELECT SoLuongTon INTO stock
    FROM sanpham 
    WHERE ProductID = NEW.ProductID;
    
    IF stock IS NULL THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Sản phẩm không tồn tại!';
    END IF;
    
    IF NEW.SoLuong > stock THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Không thể thêm vào giỏ hàng: Số lượng yêu cầu vượt quá tồn kho!';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_cart_update_check_stock` BEFORE UPDATE ON `giohang_sanpham` FOR EACH ROW BEGIN
    DECLARE stock INT;
    
    SELECT SoLuongTon INTO stock
    FROM sanpham 
    WHERE ProductID = NEW.ProductID;
    
    IF NEW.SoLuong > stock THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Không thể cập nhật: Số lượng trong giỏ vượt quá tồn kho hiện tại!';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `loaisanpham`
--

CREATE TABLE `loaisanpham` (
  `MaLoai` int(11) NOT NULL,
  `TenLoai` varchar(100) DEFAULT NULL,
  `LoaiCha` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loaisanpham`
--

INSERT INTO `loaisanpham` (`MaLoai`, `TenLoai`, `LoaiCha`) VALUES
(1, 'Điện thoại và Phụ kiện', NULL),
(2, 'Laptop & Máy tính', NULL),
(3, 'Thời trang nam', NULL),
(4, 'Thời trang nữ', NULL),
(5, 'Mẹ và bé', NULL),
(6, 'Nhà cửa & Đời sống', NULL),
(7, 'Sức khỏe & Làm đẹp', NULL),
(8, 'Thể thao & Dã ngoại', NULL),
(9, 'Sách & Văn phòng phẩm', NULL),
(10, 'Ô tô & Xe máy', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `nguoiban`
--

CREATE TABLE `nguoiban` (
  `id` int(11) NOT NULL,
  `role_nguoi_ban` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoiban`
--

INSERT INTO `nguoiban` (`id`, `role_nguoi_ban`) VALUES
(1, 'seller'),
(6, 'seller'),
(8, 'seller'),
(9, 'seller'),
(10, 'seller'),
(14, 'seller'),
(15, 'seller');

--
-- Triggers `nguoiban`
--
DELIMITER $$
CREATE TRIGGER `trg_disjoint_before_insert_nguoiban` BEFORE INSERT ON `nguoiban` FOR EACH ROW BEGIN
    IF EXISTS (SELECT 1 FROM nguoimua WHERE id = NEW.id)
       OR EXISTS (SELECT 1 FROM admin WHERE id = NEW.id) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Một người không thể có nhiều vai trò cùng lúc!';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `id` int(11) NOT NULL,
  `ten_dang_nhap` varchar(50) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `ho_va_tendem` varchar(100) NOT NULL,
  `ten` varchar(50) NOT NULL,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoidung`
--

INSERT INTO `nguoidung` (`id`, `ten_dang_nhap`, `mat_khau`, `ho_va_tendem`, `ten`, `so_dien_thoai`, `ngay_tao`) VALUES
(1, 'admin', '$2b$12$XSISwwEc3/T.Wnag32TNTeOrVSKmBYYGn4.E1Hg1SRelUgPLs48qq', 'Quản Trị', 'Viên', NULL, NULL),
(5, 'customer1', '123456', 'T', 'H', '0936101010', '2025-12-03 08:40:16'),
(6, 'customer2', '712005', 'T', 'H', '0913101010', '2025-12-03 08:41:03'),
(7, 'customer3', '654321', 'T', 'K', '0912101010', '2025-12-03 08:42:00'),
(8, 'ussername5', '456789', 'T', 'T', '0993663636', '2025-12-03 10:20:41'),
(9, 'seller1', '123456', 'H', 'T', '0954612323', '2025-12-06 11:50:19'),
(10, 'seller2', '987654', 'Đ', 'H', '0986123456', '2025-12-06 11:51:04'),
(11, 'buyer1', '654321', 'N', 'G', '0965412310', '2025-12-06 11:51:45'),
(12, 'buyer2', '123456', 'N', 'K', '0945612323', '2025-12-06 11:53:32'),
(13, 'buyer3', '654321', 'T', 'D', '0912345678', '2025-12-06 11:54:35'),
(14, 'seller5', '123456', 'T', 'H', '0936123456', '2025-12-06 16:34:58'),
(15, 'seller4', '654321', 'A', 'H', '0913311331', '2025-12-06 16:50:24'),
(16, 'buyer5', '712005', 'T', 'H', '0913456789', '2025-12-08 15:11:33'),
(21, 'admin1', '123456', 'Quản Trị', 'Viên', NULL, NULL),
(22, 'admin2', '123456', 'T', 'H', '0936101010', '2025-12-03 08:40:16'),
(23, 'admin3', '712005', 'T', 'H', '0913101010', '2025-12-03 08:41:03'),
(24, 'admin4', '654321', 'T', 'K', '0912101010', '2025-12-03 08:42:00'),
(25, 'admin5', '456789', 'T', 'T', '0993663636', '2025-12-03 10:20:41');

-- --------------------------------------------------------

--
-- Table structure for table `nguoimua`
--

CREATE TABLE `nguoimua` (
  `id` int(11) NOT NULL,
  `role_nguoi_mua` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoimua`
--

INSERT INTO `nguoimua` (`id`, `role_nguoi_mua`) VALUES
(5, 'buyer'),
(7, 'buyer'),
(11, 'buyer'),
(12, 'buyer'),
(13, 'buyer'),
(16, 'buyer');

--
-- Triggers `nguoimua`
--
DELIMITER $$
CREATE TRIGGER `trg_disjoint_before_insert_nguoimua` BEFORE INSERT ON `nguoimua` FOR EACH ROW BEGIN
    IF EXISTS (SELECT 1 FROM nguoiban WHERE id = NEW.id)
       OR EXISTS (SELECT 1 FROM admin WHERE id = NEW.id) THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Một người không thể có nhiều vai trò cùng lúc!';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `order_cart_relation`
--

CREATE TABLE `order_cart_relation` (
  `OrderID` int(11) NOT NULL,
  `CartName` varchar(255) NOT NULL,
  `ScartID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_cart_relation`
--

INSERT INTO `order_cart_relation` (`OrderID`, `CartName`, `ScartID`) VALUES
(2, 'default', 11),
(3, 'default', 11),
(4, 'default', 5),
(5, 'default', 5),
(6, 'default', 13);

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `ProductID` int(11) NOT NULL,
  `OrderID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`ProductID`, `OrderID`, `Quantity`) VALUES
(9, 3, 1),
(9, 4, 1),
(11, 5, 1),
(18, 2, 1),
(18, 5, 2),
(19, 2, 1),
(19, 3, 1),
(19, 6, 1),
(20, 2, 1),
(20, 4, 1),
(20, 6, 1),
(31, 3, 1);

--
-- Triggers `order_details`
--
DELIMITER $$
CREATE TRIGGER `trg_check_stock_before_insert` BEFORE INSERT ON `order_details` FOR EACH ROW BEGIN
    DECLARE stock INT;

    SELECT SoLuongTon INTO stock 
    FROM sanpham 
    WHERE ProductID = NEW.ProductID;

    IF stock < NEW.Quantity THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Số lượng tồn kho không đủ để đặt hàng';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_reduce_stock_after_insert` AFTER INSERT ON `order_details` FOR EACH ROW BEGIN
    UPDATE sanpham
    SET SoLuongTon = SoLuongTon - NEW.Quantity
    WHERE ProductID = NEW.ProductID;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_restore_stock_after_delete` AFTER DELETE ON `order_details` FOR EACH ROW BEGIN
    UPDATE sanpham
    SET SoLuongTon = SoLuongTon + OLD.Quantity
    WHERE ProductID = OLD.ProductID;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_total_after_delete` AFTER DELETE ON `order_details` FOR EACH ROW BEGIN
    UPDATE donhang d
    SET d.TongTien = (
        SELECT COALESCE(SUM(s.Gia * od.Quantity), 0)
        FROM order_details od
        JOIN sanpham s ON od.ProductID = s.ProductID
        WHERE od.OrderID = OLD.OrderID
    )
    WHERE d.OrderID = OLD.OrderID;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_update_total_after_insert` AFTER INSERT ON `order_details` FOR EACH ROW BEGIN
    UPDATE donhang d
    SET d.TongTien = (
        SELECT SUM(s.Gia * od.Quantity)
        FROM order_details od
        JOIN sanpham s ON od.ProductID = s.ProductID
        WHERE od.OrderID = NEW.OrderID
    )
    WHERE d.OrderID = NEW.OrderID;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `rankuser`
--

CREATE TABLE `rankuser` (
  `id` int(11) NOT NULL,
  `muc_rank` varchar(50) NOT NULL,
  `diem_hien_co` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rankuser`
--

INSERT INTO `rankuser` (`id`, `muc_rank`, `diem_hien_co`) VALUES
(5, 'Đồng', 100),
(7, 'Kim Cương', 1500),
(11, 'Bạc', 300),
(12, 'Vàng', 600),
(13, 'Bạch Kim', 1000);

-- --------------------------------------------------------

--
-- Table structure for table `sanpham`
--

CREATE TABLE `sanpham` (
  `ProductID` int(11) NOT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL,
  `TenSanPham` varchar(150) NOT NULL,
  `MoTa` text DEFAULT NULL,
  `Gia` decimal(15,2) NOT NULL,
  `SoLuongTon` int(11) NOT NULL DEFAULT 0,
  `MaLoai` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sanpham`
--

INSERT INTO `sanpham` (`ProductID`, `HinhAnh`, `TenSanPham`, `MoTa`, `Gia`, `SoLuongTon`, `MaLoai`) VALUES
(6, '1764912644_01_logobachkhoasang.png', 'aaaaaaaa', 'aaaaaaaaaaaaaaa', 111111111.00, 20, 3),
(9, '1764974433_01_logobachkhoasang.png', 'bbbbbbbbbbb', 'bbbbbbbbbbbbbbbbbbbbbbbb', 2222222.00, 20, 8),
(11, '1764974568_01_logobachkhoasang.png', 'ddddd', 'dddddddddddd', 4444444.00, 3, 1),
(18, '1764912644_01_logobachkhoasang.png', 'Điện thoại Samsung A15', 'Mô tả...', 4500000.00, 17, 1),
(19, '1764912644_01_logobachkhoasang.png', 'Điện thoại IPhone 17', 'Mô tả...', 22000000.00, 17, 1),
(20, '1764912644_01_logobachkhoasang.png', 'Airpods 3', 'Mô tả...', 4500000.00, 17, 1),
(29, '1764990862_01_logobachkhoasang.png', 'gggg', 'gggggggggggg', 1500000.00, 10, 1),
(31, '1765063044_01_logobachkhoasang.png', 'hhhh', 'hhhhhhhhhh', 1500000.00, 9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `useraddress`
--

CREATE TABLE `useraddress` (
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `useraddress`
--

INSERT INTO `useraddress` (`id`, `address`) VALUES
(5, 'TPHCM'),
(6, 'Quảng Ngãi'),
(7, 'Vĩnh Long'),
(8, 'Tiền Giang'),
(9, 'Vũng Tàu');

-- --------------------------------------------------------

--
-- Table structure for table `uudai`
--

CREATE TABLE `uudai` (
  `ProductID` int(11) NOT NULL,
  `ThoiGianBatDau` datetime NOT NULL,
  `ThoiGianKetThuc` datetime NOT NULL,
  `MucUuDai` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uudai`
--

INSERT INTO `uudai` (`ProductID`, `ThoiGianBatDau`, `ThoiGianKetThuc`, `MucUuDai`) VALUES
(6, '2025-01-01 00:00:00', '2025-01-10 00:00:00', 10.00),
(9, '2025-02-01 00:00:00', '2025-02-15 00:00:00', 15.00),
(11, '2025-03-05 00:00:00', '2025-03-20 00:00:00', 20.00),
(18, '2025-04-10 00:00:00', '2025-04-30 00:00:00', 25.00),
(19, '2025-05-01 00:00:00', '2025-05-15 00:00:00', 30.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `danglen`
--
ALTER TABLE `danglen`
  ADD PRIMARY KEY (`ProductID`,`SellerID`),
  ADD KEY `SellerID` (`SellerID`);

--
-- Indexes for table `donhang`
--
ALTER TABLE `donhang`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `BuyerID` (`BuyerID`),
  ADD KEY `SellerID` (`SellerID`);

--
-- Indexes for table `giaodich`
--
ALTER TABLE `giaodich`
  ADD PRIMARY KEY (`OrderID`,`BuyerID`),
  ADD KEY `BuyerID` (`BuyerID`),
  ADD KEY `SellerID` (`SellerID`);

--
-- Indexes for table `giohang`
--
ALTER TABLE `giohang`
  ADD PRIMARY KEY (`id`,`ten_gio_hang`);

--
-- Indexes for table `giohang_sanpham`
--
ALTER TABLE `giohang_sanpham`
  ADD PRIMARY KEY (`ProductID`,`id`,`ten_gio_hang`),
  ADD KEY `id` (`id`,`ten_gio_hang`);

--
-- Indexes for table `loaisanpham`
--
ALTER TABLE `loaisanpham`
  ADD PRIMARY KEY (`MaLoai`),
  ADD KEY `LoaiCha` (`LoaiCha`);

--
-- Indexes for table `nguoiban`
--
ALTER TABLE `nguoiban`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`);

--
-- Indexes for table `nguoimua`
--
ALTER TABLE `nguoimua`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_cart_relation`
--
ALTER TABLE `order_cart_relation`
  ADD PRIMARY KEY (`OrderID`,`CartName`,`ScartID`),
  ADD KEY `ScartID` (`ScartID`,`CartName`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`ProductID`,`OrderID`),
  ADD KEY `OrderID` (`OrderID`);

--
-- Indexes for table `rankuser`
--
ALTER TABLE `rankuser`
  ADD PRIMARY KEY (`id`,`muc_rank`);

--
-- Indexes for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `MaLoai` (`MaLoai`);

--
-- Indexes for table `useraddress`
--
ALTER TABLE `useraddress`
  ADD PRIMARY KEY (`id`,`address`);

--
-- Indexes for table `uudai`
--
ALTER TABLE `uudai`
  ADD PRIMARY KEY (`ProductID`,`ThoiGianBatDau`,`ThoiGianKetThuc`,`MucUuDai`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `donhang`
--
ALTER TABLE `donhang`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `loaisanpham`
--
ALTER TABLE `loaisanpham`
  MODIFY `MaLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`id`) REFERENCES `nguoidung` (`id`);

--
-- Constraints for table `danglen`
--
ALTER TABLE `danglen`
  ADD CONSTRAINT `danglen_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `sanpham` (`ProductID`),
  ADD CONSTRAINT `danglen_ibfk_2` FOREIGN KEY (`SellerID`) REFERENCES `nguoiban` (`id`);

--
-- Constraints for table `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`BuyerID`) REFERENCES `nguoimua` (`id`),
  ADD CONSTRAINT `donhang_ibfk_2` FOREIGN KEY (`SellerID`) REFERENCES `nguoiban` (`id`);

--
-- Constraints for table `giaodich`
--
ALTER TABLE `giaodich`
  ADD CONSTRAINT `giaodich_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `donhang` (`OrderID`),
  ADD CONSTRAINT `giaodich_ibfk_2` FOREIGN KEY (`BuyerID`) REFERENCES `nguoimua` (`id`),
  ADD CONSTRAINT `giaodich_ibfk_3` FOREIGN KEY (`SellerID`) REFERENCES `nguoiban` (`id`);

--
-- Constraints for table `giohang`
--
ALTER TABLE `giohang`
  ADD CONSTRAINT `giohang_ibfk_1` FOREIGN KEY (`id`) REFERENCES `nguoimua` (`id`);

--
-- Constraints for table `giohang_sanpham`
--
ALTER TABLE `giohang_sanpham`
  ADD CONSTRAINT `giohang_sanpham_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `sanpham` (`ProductID`),
  ADD CONSTRAINT `giohang_sanpham_ibfk_2` FOREIGN KEY (`id`,`ten_gio_hang`) REFERENCES `giohang` (`id`, `ten_gio_hang`);

--
-- Constraints for table `loaisanpham`
--
ALTER TABLE `loaisanpham`
  ADD CONSTRAINT `loaisanpham_ibfk_1` FOREIGN KEY (`LoaiCha`) REFERENCES `loaisanpham` (`MaLoai`);

--
-- Constraints for table `nguoiban`
--
ALTER TABLE `nguoiban`
  ADD CONSTRAINT `nguoiban_ibfk_1` FOREIGN KEY (`id`) REFERENCES `nguoidung` (`id`);

--
-- Constraints for table `nguoimua`
--
ALTER TABLE `nguoimua`
  ADD CONSTRAINT `nguoimua_ibfk_1` FOREIGN KEY (`id`) REFERENCES `nguoidung` (`id`);

--
-- Constraints for table `order_cart_relation`
--
ALTER TABLE `order_cart_relation`
  ADD CONSTRAINT `order_cart_relation_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `donhang` (`OrderID`),
  ADD CONSTRAINT `order_cart_relation_ibfk_2` FOREIGN KEY (`ScartID`,`CartName`) REFERENCES `giohang` (`id`, `ten_gio_hang`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `sanpham` (`ProductID`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`OrderID`) REFERENCES `donhang` (`OrderID`);

--
-- Constraints for table `rankuser`
--
ALTER TABLE `rankuser`
  ADD CONSTRAINT `rankuser_ibfk_1` FOREIGN KEY (`id`) REFERENCES `nguoimua` (`id`);

--
-- Constraints for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`MaLoai`) REFERENCES `loaisanpham` (`MaLoai`);

--
-- Constraints for table `useraddress`
--
ALTER TABLE `useraddress`
  ADD CONSTRAINT `useraddress_ibfk_1` FOREIGN KEY (`id`) REFERENCES `nguoidung` (`id`);

--
-- Constraints for table `uudai`
--
ALTER TABLE `uudai`
  ADD CONSTRAINT `uudai_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `sanpham` (`ProductID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
