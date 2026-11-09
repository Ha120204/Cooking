// Sửa nội dung tại đây. Giá trị rỗng sẽ không xuất hiện trong Footer.
const hotline = "0327830575";
const email = "thanhthanhnguyenthi467@gmail.com";

export const siteConfig = {
  footer: {
    brand: {
      name: "Bếp Nhà Mình",
      slogan: "Hương vị cơm nhà",
      description: "Góc nhỏ cùng chia sẻ công thức, mẹo nấu ăn và những bữa cơm gia đình Việt. Mời bạn ghé bếp, hỏi han và kể chuyện món ngon.",
    },
    explore: {
      heading: "Khám phá",
      links: [
        { label: "Công thức", href: "/cong-thuc" },
        { label: "Thực đơn tuần", href: "/thuc-don-tuan" },
        { label: "Hôm nay ăn gì?", href: "/hom-nay-an-gi" },
        { label: "Hỏi bếp", href: "/hoi-bep" },
        { label: "Góp công thức", href: "/gui-cong-thuc" },
      ],
    },
    contact: {
      heading: "Liên hệ",
      hotline: { label: "Hotline", value: hotline, href: hotline ? `tel:${hotline}` : "" },
      email: { label: "Email", value: email, href: email ? `mailto:${email}` : "" },
      zalo: { label: "Zalo", value: "Thanh Tuyền", href: hotline ? `https://zalo.me/${hotline}` : "" },
      facebook: { label: "Fanpage", value: "Thanh Tuyền" },
    },
    information: {
      heading: "Thông tin",
      links: [
        { label: "Về Bếp Nhà Mình", href: "/gioi-thieu" },
        { label: "Quy định cộng đồng", href: "/quy-dinh-cong-dong" },
        { label: "Chính sách riêng tư", href: "/chinh-sach-rieng-tu" },
      ],
    },
    bottom: {
      nonCommercial: "Website cá nhân, phi thương mại",
      analytics: "Số liệu truy cập đo bằng Google Analytics",
    },
  },
  introduction: {
    eyebrow: "Câu chuyện Bếp Nhà Mình",
    title: "Về Bếp Nhà Mình",
    lead: "Bếp Nhà Mình là một góc cộng đồng để tìm công thức quen thuộc, chia sẻ kinh nghiệm nấu ăn và cùng nhau giữ hương vị bữa cơm gia đình.",
    creatorHeading: "Ai giữ bếp?",
    creator: "[ĐIỀN: Tên người thực hiện và đôi lời bạn muốn giới thiệu về mình.]",
    reasonHeading: "Vì sao có Bếp Nhà Mình?",
    reason: "[ĐIỀN: Lý do riêng khiến bạn bắt đầu làm website này.]",
    wishHeading: "Điều mình mong muốn",
    wish: "[ĐIỀN: Điều bạn mong cộng đồng nấu ăn này mang lại.]",
  },
} as const;
