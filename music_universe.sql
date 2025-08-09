-- MUSIC_UNIVERSE — Full schema
-- Charset & timezone
SET NAMES utf8mb4;
SET time_zone = '+07:00';

-- Database
CREATE DATABASE IF NOT EXISTS music_universe
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE music_universe;

-- 1) USERS (quản trị viên & người dùng)
CREATE TABLE users (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  account_name   VARCHAR(60)  NOT NULL UNIQUE,
  email          VARCHAR(191) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  role           ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_locked      TINYINT(1)   NOT NULL DEFAULT 0,
  locked_at      DATETIME NULL,
  locked_reason  VARCHAR(255) NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_created (created_at),
  INDEX idx_users_role_locked (role, is_locked, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) GENRES (thể loại)
CREATE TABLE genres (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(80) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) SONGS (bài hát)
CREATE TABLE songs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(150) NOT NULL,
  artist_name   VARCHAR(180) NOT NULL,
  genre_id      INT NULL,             
  duration_sec  INT NULL,                   
  audio_url     VARCHAR(255) NOT NULL,    
  image_url     VARCHAR(255) NULL,        
  lyrics        TEXT NULL,         
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_songs_genre FOREIGN KEY (genre_id)
    REFERENCES genres(id) ON DELETE SET NULL,
  INDEX idx_songs_title        (title),
  INDEX idx_songs_artist_name  (artist_name),
  INDEX idx_songs_genre        (genre_id),
  INDEX idx_songs_created      (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) FAVORITES (yêu thích)
CREATE TABLE favorites (
  user_id   INT NOT NULL,
  song_id   INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, song_id),
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_song FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  INDEX (song_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) SUPPORT REQUESTS (liên hệ/hỗ trợ)
CREATE TABLE support_requests (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NULL,                                   
  full_name     VARCHAR(120) NOT NULL,
  account_name  VARCHAR(60)  NULL,
  email         VARCHAR(191) NOT NULL,
  topic         ENUM('ky_thuat','tai_khoan','thanh_toan','khac') NOT NULL DEFAULT 'khac',
  subject       VARCHAR(180) NOT NULL,                      
  content       TEXT NOT NULL,                               
  status        ENUM('mo','dang_xu_ly','da_giai_quyet') NOT NULL DEFAULT 'mo',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at   DATETIME NULL,
  resolved_by   INT NULL,                              
  admin_note    TEXT NULL,                              
  CONSTRAINT fk_sr_user   FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_sr_admin  FOREIGN KEY (resolved_by)  REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_sr_status   (status),
  INDEX idx_sr_created  (created_at),
  INDEX idx_sr_email    (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

USE music_universe;

-- ===== USERS (2 admin + 2 user demo) =====
INSERT INTO users (name, account_name, email, password_hash, role, is_locked)
VALUES
('Quản Trị Viên', 'admin',    'admin@example.com',    'DEMO_ONLY', 'admin', 0),
('Moderator',     'mod',      'mod@example.com',      'DEMO_ONLY', 'admin', 0),
('Nguyễn Văn A',  'nguyenvana','a@example.com',       'DEMO_ONLY', 'user',  0),
('Trần Thị B',    'tranthib', 'b@example.com',        'DEMO_ONLY', 'user',  0);

-- ===== GENRES (khớp các filter UI) =====
INSERT IGNORE INTO genres (name) VALUES
('Ballad'), ('Lofi'), ('Remix'), ('V-pop'), ('Rap'), ('Nhạc trẻ');

-- ===== SONGS (tên, nghệ sĩ, thể loại, thời lượng, link file) =====
-- Durations: 5:02=302, 5:13=313, 5:01=301, 4:51=291, 4:40=280, 4:30=270, 4:15=255, 4:05=245
INSERT INTO songs (title, artist_name, genre_id, duration_sec, audio_url, image_url, lyrics)
VALUES
('Mở Lối Cho Em', 'Lương Huy Tuấn, Hữu Công',
  (SELECT id FROM genres WHERE name='Nhạc trẻ' LIMIT 1),
  302, '/uploads/audio/mo_loi_cho_em.mp3', '/uploads/images/mo_loi_cho_em.jpg',
  'Lời bài hát...'),

('Nỗi Nhớ Vô Hạn', 'Thanh Hưng',
  (SELECT id FROM genres WHERE name='Nhạc trẻ' LIMIT 1),
  313, '/uploads/audio/noi_nho_vo_han.mp3', '/uploads/images/noi_nho_vo_han.jpg',
  NULL),

('Mở Lối Cho Em 2', 'Lương Huy Tuấn, An Clock',
  (SELECT id FROM genres WHERE name='Nhạc trẻ' LIMIT 1),
  301, '/uploads/audio/mo_loi_cho_em_2.mp3', '/uploads/images/mo_loi_cho_em_2.jpg',
  NULL),

('Vạn Sự Tuỳ Duyên', 'Thanh Hưng',
  (SELECT id FROM genres WHERE name='Ballad' LIMIT 1),
  291, '/uploads/audio/van_su_tuy_duyen.mp3', '/uploads/images/van_su_tuy_duyen.jpg',
  NULL),

('Dưới Tán Cây Khô Hoa Nở', 'J97',
  (SELECT id FROM genres WHERE name='Rap' LIMIT 1),
  280, '/uploads/audio/duoi_tan_cay_kho_hoa_no.mp3', '/uploads/images/duoi_tan_cay_kho_hoa_no.jpg',
  NULL),

('Suốt Đời Không Xứng', 'Khải Đăng, Vương Anh Tú, Ribi Sachi',
  (SELECT id FROM genres WHERE name='Ballad' LIMIT 1),
  270, '/uploads/audio/suot_doi_khong_xung.mp3', '/uploads/images/suot_doi_khong_xung.jpg',
  NULL),

('Chạnh Lòng Thương Cô 4', 'Huy Vạc',
  (SELECT id FROM genres WHERE name='Ballad' LIMIT 1),
  255, '/uploads/audio/chanh_long_thuong_co_4.mp3', '/uploads/images/chanh_long_thuong_co_4.jpg',
  NULL),

('Chiều Thu Hoạ Bóng Nàng', 'ĐạtKaa',
  (SELECT id FROM genres WHERE name='Ballad' LIMIT 1),
  255, '/uploads/audio/chieu_thu_hoa_bong_nang.mp3', '/uploads/images/chieu_thu_hoa_bong_nang.jpg',
  NULL),

('Trả Lại Thanh Xuân Cho Em', 'H2K',
  (SELECT id FROM genres WHERE name='Ballad' LIMIT 1),
  245, '/uploads/audio/tra_lai_thanh_xuan_cho_em.mp3', '/uploads/images/tra_lai_thanh_xuan_cho_em.jpg',
  NULL);

-- ===== FAVORITES (đánh dấu vài bài yêu thích cho 2 user) =====
INSERT IGNORE INTO favorites (user_id, song_id)
SELECT u.id, s.id FROM users u JOIN songs s ON s.title='Mở Lối Cho Em' WHERE u.account_name='nguyenvana'
UNION ALL
SELECT u.id, s.id FROM users u JOIN songs s ON s.title='Nỗi Nhớ Vô Hạn' WHERE u.account_name='nguyenvana'
UNION ALL
SELECT u.id, s.id FROM users u JOIN songs s ON s.title='Vạn Sự Tuỳ Duyên' WHERE u.account_name='nguyenvana'
UNION ALL
SELECT u.id, s.id FROM users u JOIN songs s ON s.title='Suốt Đời Không Xứng' WHERE u.account_name='tranthib'
UNION ALL
SELECT u.id, s.id FROM users u JOIN songs s ON s.title='Chiều Thu Hoạ Bóng Nàng' WHERE u.account_name='tranthib'
UNION ALL
SELECT u.id, s.id FROM users u JOIN songs s ON s.title='Trả Lại Thanh Xuân Cho Em' WHERE u.account_name='tranthib';

-- ===== SUPPORT REQUESTS (2 ticket demo) =====
INSERT INTO support_requests (user_id, full_name, account_name, email, topic, subject, content, status)
VALUES
((SELECT id FROM users WHERE account_name='nguyenvana' LIMIT 1),
 'Nguyễn Văn A','nguyenvana','a@example.com','ky_thuat',
 'Không đăng nhập được','Tôi gặp vấn đề khi sử dụng tính năng đăng nhập.','mo'),

((SELECT id FROM users WHERE account_name='tranthib' LIMIT 1),
 'Trần Thị B','tranthib','b@example.com','khac',
 'Góp ý giao diện','Màu nền hơi tối, mong có tuỳ chọn sáng.','mo');

