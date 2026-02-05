import { prisma } from "./client";
import { hashPassword } from "../services/users.service";
import { ACCOUNT_TYPE } from "./constant";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  const countRole = await prisma.role.count();
  const countProduct = await prisma.product.count();

  if (countRole === 0) {
    await prisma.role.createMany({
      data: [
        {
          name: "ADMIN",
          description: "Full authorization",
        },
        {
          name: "USER",
          description: "Normal user",
        },
      ],
    });
  }

  if (countUser === 0) {
    const defaultPassword = await hashPassword("123456");
    const adminRole = await prisma.role.findFirst({
      where: { name: "ADMIN" },
    });
    const userRole = await prisma.role.findFirst({
      where: { name: "USER" },
    });
    if (adminRole) {
      await prisma.user.createMany({
        data: [
          {
            name: "Tai",
            username: "taibui9747@gmail.com",
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: userRole!.id,
            avatar: "snow.jpg",
          },
          {
            name: "Admin",
            username: "admin@gmail.com",
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            roleId: adminRole.id,
            avatar: "snow.jpg",
          },
        ],
      });
    }
  }

  if (countProduct === 0) {
    const products = [
      {
        name: "Laptop Asus TUF Gaming",
        price: 1200,
        detailDesc: `READY FOR ANYTHING - Jump right into the action with Windows 11, an Intel Core i7-13620HCPU, and NVIDIA GeForce RTX 4060 Laptop GPU at 140W Max TGP.
SWIFT MEMORY AND STORAGE – Multitask faster with 16GB of DDR5-4800MHz memory and speed up loading times with 1TB of PCIe 4x4.
NEVER MISS A MOMENT – Keep up with the pros thanks to its fast FHD 144Hz display with 100% sRGB color. Adaptive sync tech reduces lag, minimizes stuttering, and eliminates visual tearing for ultra-smooth and lifelike gameplay.`,
        shortDesc: " Intel, Core i5, 11400H",
        quantity: 100,
        brand: "ASUS",
        category: "GAMING",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711078092373-asus-01.png`,
      },
      {
        name: "Laptop Dell Inspiron 15",
        price: 3000,
        detailDesc: `Experience responsive yet quiet performance, featuring up to 12th generation Intel® Core™ processors combined with PCIe SSD options.
Benefit from roomy keycaps and a spacious touchpad that makes it easier to navigate your content and ComfortView software, which is a TUV Rheinland certified solution, reduces harmful blue light emissions to keep your eyes comfortable over extended viewing times. Also, sleek three-side narrow borders encase a FHD display.`,
        shortDesc: 'i5 1235U/16GB/512GB/15.6"FHD',
        quantity: 200,
        brand: "DELL",
        category: "OFFICE",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711078452562-dell-01.png`,
      },
      {
        name: "Lenovo IdeaPad Gaming 3",
        price: 1000,
        detailDesc: `The IdeaPad 3 is priced as an everyday-use laptop—but engineered as something much more. Premium Intel® processing—as well as powerful memory and storage options—means this PC delivers beyond expectations. Bonus: The numeric keypad will speed up your productivity, whether you’re working on your personal budget or preparing a spreadsheet`,
        shortDesc: " i5-10300H, RAM 8G",
        quantity: 150,
        brand: "LENOVO",
        category: "GAMING",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711079073759-lenovo-01.png`,
      },
      {
        name: "Asus K501UX",
        price: 1500,
        detailDesc: `14 inches 1920 x 1080 (Full HD) Anti-glare Three-Sided NanoEdge Design.`,
        shortDesc: "VGA NVIDIA GTX 950M- 4G",
        quantity: 99,
        brand: "ASUS",
        category: "GRAPHIC",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711079496409-asus-02.png`,
      },
      {
        name: "MacBook Air 13",
        price: 1000,
        detailDesc: `Remarkably light and less than half an inch thin, MacBook Air fits easily into your on-the-go lifestyle — and your bag. MacBook Air with M4 is made with over 50 percent recycled materials and has a durable recycled aluminum enclosure.`,
        shortDesc: "Apple M1 GPU 7 cores",
        quantity: 99,
        brand: "APPLE",
        category: "GAMING",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711079954090-apple-01.png`,
      },
      {
        name: "Laptop LG Gram Style",
        price: 2000,
        detailDesc: `LG gram delivers powerhouse AI performance in an ultra-thin, ultra-light design. Weighing just 3.2 lbs., the sleek 17” anti-glare touch display is built for productivity anywhere. With an Intel¹ Evo Edition Core Ultra 7 processor, for AI intensive workloads, the laptop provides performance, boosts efficiency, and fuel AI productivity.`,
        shortDesc: "Intel Iris Plus Graphics",
        quantity: 99,
        brand: "LG",
        category: "OFFICE",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711080386941-lg-01.png`,
      },
      {
        name: "MacBook Air 13",
        price: 1100,
        detailDesc: ``,

        shortDesc: "Apple M2 GPU 8 cores",
        quantity: 99,
        brand: "APPLE",
        category: "COMPACT",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711080787179-apple-02.png`,
      },
      {
        name: "Laptop Acer Nitro",
        price: 1300,
        detailDesc: `Remarkably light and less than half an inch thin, MacBook Air fits easily into your on-the-go lifestyle — and your bag. MacBook Air with M4 is made with over 50 percent recycled materials and has a durable recycled aluminum enclosure.`,
        shortDesc: "AN515-58-769J i7 12700H",
        quantity: 99,
        brand: "ACER",
        category: "OFFICE",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711080948771-acer-01.png`,
      },
      {
        name: "Laptop Acer Nitro V",
        price: 1200,
        detailDesc: `The Acer Nitro V 15 ANV15-51 notebook is engineered for those who demand power and performance, whether for gaming, content creation, or multitasking. At the heart of this notebook lies a 10-core Intel Core i7 processor and NVIDIA GeForce RTX graphics, ensuring smooth and responsive performance across all your applications.
The 15.6-inch Full HD IPS display, enhanced with Acer BluelightShield and ComfyView technologies, offers vivid colors and sharp details while minimizing eye strain during long sessions. The raised bezel and Narrow Border Display design maximize screen real estate, providing an immersive experience.
Connectivity is never an issue with the Acer Nitro V 15, featuring a range of ports including HDMI, USB-C 3.2 Gen 2/Thunderbolt 4/DisplayPort, and USB 3.2 Gen 1, catering to all your peripheral needs. The notebook's robust design, combining ABS plastic and polycarbonate materials, is both sleek and durable, ready to withstand the rigors of daily use while keeping your device secure with a Kensington security slot. Dual microphones and stereo speakers round out the package, offering a superior audio experience for gaming, movies, and video conferencing.`,
        shortDesc: "NVIDIA GeForce RTX 4050",
        quantity: 99,
        brand: "ASUS",
        category: "COMPACT",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711081080930-asus-03.png`,
      },
      {
        name: "Laptop Dell Latitude 3420",
        price: 1230,
        detailDesc: `Up to 11th Gen Intel® TGL-U Celeron Core™ i7 processors offer businesses the performance, manageability, built-in security features and stability of Intel® and align to a future-proof roadmap. Download and smoothly run graphic-intensive applications with optional NVIDIA MX450.
`,
        shortDesc: "Intel Iris Xe Graphics",
        quantity: 99,
        brand: "DELL",
        category: "COMPACT",
        image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/images/product/1711081278418-dell-02.png`,
      },
    ];

    await prisma.product.createMany({
      data: products,
    });
  }
  if (countRole !== 0 && countUser !== 0 && countProduct !== 0) {
    console.log(">>> ALREADY INIT DATA...");
  }
};

export default initDatabase;
