/*
  قائمة الفيديوهات — عدّل هذه القائمة بسهولة لإضافة فيديوهاتك الخاصة.
  للحصول على youtubeId: افتح الفيديو على يوتيوب، اضغط "مشاركة" ثم "تضمين"،
  وستجد الكود بهذا الشكل: youtube.com/embed/XXXXXXXXXXX  -> XXXXXXXXXXX هو الـ id
*/
const VIDEOS = [
  {
    youtubeId: "YOUR_VIDEO_ID_1",
    thumbnail: "assets/video-deen-w-donya.jpg",
    title: "دين و دنيا",
    category: "خطب",
    channel: "الشيخ أمجد سمير",
    duration: "—"
  },
  {
    youtubeId: "YOUR_VIDEO_ID_2",
    thumbnail: "assets/video-daye-been.jpg",
    title: "ضايع بين كل حاجة؟",
    category: "خطب",
    channel: "الشيخ أحمد النفيس",
    duration: "—"
  },
  {
    youtubeId: "YOUR_VIDEO_ID_3",
    title: "قصة النبي يوسف عليه السلام",
    category: "قصص الأنبياء",
    channel: "قناة نور الهدى",
    duration: "18:45"
  },
  {
    youtubeId: "YOUR_VIDEO_ID_4",
    title: "أذكار الصباح كاملة",
    category: "أذكار وأدعية",
    channel: "قناة نور الهدى",
    duration: "09:32"
  },
  {
    youtubeId: "YOUR_VIDEO_ID_5",
    title: "تلاوة خاشعة من سورة الرحمن",
    category: "تلاوات",
    channel: "قناة نور الهدى",
    duration: "11:05"
  },
  {
    youtubeId: "YOUR_VIDEO_ID_6",
    title: "خطبة عن بر الوالدين",
    category: "خطب",
    channel: "قناة نور الهدى",
    duration: "16:12"
  },
  {
    youtubeId: "YOUR_VIDEO_ID_7",
    title: "تفسير آية الكرسي",
    category: "تفسير",
    channel: "قناة نور الهدى",
    duration: "13:00"
  },
  {
    youtubeId: "YOUR_VIDEO_ID_8",
    title: "قصة أصحاب الكهف",
    category: "قصص الأنبياء",
    channel: "قناة نور الهدى",
    duration: "20:15"
  },
  {
    youtubeId: "YOUR_VIDEO_ID_9",
    title: "أذكار المساء كاملة",
    category: "أذكار وأدعية",
    duration: "08:47",
    channel: "قناة نور الهدى"
  }
];

const CATEGORIES = ["الكل", "خطب", "تفسير", "قصص الأنبياء", "أذكار وأدعية", "تلاوات"];
