import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const DATA = {
  profile: {
    name: "Shanbel Dires",
    role: "Full-Stack Software Engineer & Network Architect",
    institution: "Addis Ababa Science and Technology University (AASTU)",
    location: "Addis Ababa, Ethiopia",
    email: "shanbel.dires@gmail.com",
    telegram: "@shanbel_dires",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    aboutBio: "Passionate software engineer and network infrastructure specialist based in Addis Ababa. I bridge the gap between robust physical infrastructure and modern web software—specializing in high-performance full-stack web applications, real-time microservices, HCIA-certified network topologies, and intelligent IP surveillance ecosystems.",
    stats: [
      { label: "Years Experience", value: "3+" },
      { label: "Projects Completed", value: "18+" },
      { label: "Certifications", value: "5+" },
      { label: "Community Mentored", value: "250+" }
    ]
  },

  socialChannels: [
    {
      id: "linkedin",
      platform: "LinkedIn",
      handle: "in/shanbel-dires",
      url: "https://linkedin.com",
      brandColor: "#0A66C2",
      bgClass: "bg-[#0A66C2]/10 border-[#0A66C2]/30 text-[#0A66C2]",
      hoverClass: "hover:bg-[#0A66C2] hover:text-white",
      iconName: "Linkedin",
      sortOrder: 1
    },
    {
      id: "github",
      platform: "GitHub",
      handle: "@shanbel-dires",
      url: "https://github.com",
      brandColor: "#181717",
      bgClass: "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white",
      hoverClass: "hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black",
      iconName: "Github",
      sortOrder: 2
    },
    {
      id: "twitter",
      platform: "X / Twitter",
      handle: "@shanbel_dires",
      url: "https://x.com",
      brandColor: "#000000",
      bgClass: "bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white",
      hoverClass: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
      iconName: "Globe",
      sortOrder: 3
    },
    {
      id: "telegram",
      platform: "Telegram",
      handle: "@shanbel_dires",
      url: "https://t.me",
      brandColor: "#229ED9",
      bgClass: "bg-[#229ED9]/10 border-[#229ED9]/30 text-[#229ED9]",
      hoverClass: "hover:bg-[#229ED9] hover:text-white",
      iconName: "Send",
      sortOrder: 4
    },
    {
      id: "email",
      platform: "Gmail Direct",
      handle: "shanbel.dires@gmail.com",
      url: "mailto:shanbel.dires@gmail.com",
      brandColor: "#EA4335",
      bgClass: "bg-[#EA4335]/10 border-[#EA4335]/30 text-[#EA4335]",
      hoverClass: "hover:bg-[#EA4335] hover:text-white",
      iconName: "Mail",
      sortOrder: 5
    },
    {
      id: "location",
      platform: "Location",
      handle: "Addis Ababa, Ethiopia",
      url: "#contact",
      brandColor: "#10B981",
      bgClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
      hoverClass: "hover:bg-emerald-600 hover:text-white",
      iconName: "MapPin",
      sortOrder: 6
    }
  ],

  specializations: [
    {
      id: "spec-hcia",
      title: "Huawei HCIA Networking",
      category: "Network Infrastructure",
      iconName: "Server",
      shortDesc: "Enterprise dynamic routing (OSPF/BGP), VLAN trunking, subnet allocation, and switch security policies.",
      detailedScope: "Deep technical expertise in enterprise network architecture design. Proficient in configuring Huawei VRP operating systems, setting up multi-area OSPF routing, configuring BGP peering, inter-VLAN trunking, Spanning Tree Protocols (STP/RSTP), and Network Access Control Lists (ACLs).",
      competencies: [
        "OSPF & BGP Dynamic Routing Protocols",
        "VLAN Isolation & Inter-VLAN Routing",
        "Network Access Control Lists (ACL)",
        "Link Aggregation & LACP Trunking",
        "Wireshark Packet Analysis & Troubleshooting"
      ],
      practicalApplication: "Engineered multi-tier enterprise network layouts with high-availability redundancy and failover routing.",
      skills: ["Routing & Switching", "VLAN / Subnetting", "Network Security", "OSPF / BGP", "Wireshark"],
      sortOrder: 1
    },
    {
      id: "spec-hikvision",
      title: "Hikvision CCTV & IP Surveillance",
      category: "Physical & IP Security",
      iconName: "Tv",
      shortDesc: "Digital IP camera architectures, NVR channel setup, PoE switching, and remote cloud video monitoring.",
      detailedScope: "End-to-end engineering of intelligent physical surveillance ecosystems. Includes IP camera addressing, Network Video Recorder (NVR/DVR) channel setup, RAID storage optimization, ONVIF stream integration, thermal motion sensing, and Hik-Connect cloud gateway integration.",
      competencies: [
        "IP Camera Addressing & ONVIF Integration",
        "NVR / DVR Storage & RAID Allocation",
        "Hik-Connect & Remote Cloud Surveillance",
        "Video Bitrate & Storage Bandwidth Optimization",
        "PoE Switch Topology & Cabling Standards"
      ],
      practicalApplication: "Deployed high-density surveillance layouts for commercial facilities with 24/7 retention and remote mobile streaming.",
      skills: ["IP Camera Config", "NVR / DVR Setup", "Remote Streaming", "Video Analytics", "PoE Infrastructure"],
      sortOrder: 2
    },
    {
      id: "spec-insa",
      title: "INSA Secure Software Engineering",
      category: "Software Development & Security",
      iconName: "Shield",
      shortDesc: "Building resilient web microservices, RESTful APIs, database schema design, and security audit telemetry.",
      detailedScope: "Comprehensive mastery of full-stack web software engineering with an emphasis on security best practices. Experience in designing decoupled React frontends, Express.js REST/GraphQL backends, PostgreSQL relational schemas, and analyzing server audit logs.",
      competencies: [
        "React Component Lifecycle & Hook State Architecture",
        "Node.js & Express RESTful API Middleware Design",
        "PostgreSQL Schema Optimization & Indexing",
        "JWT Authentication & Role-Based Authorization",
        "System Log Telemetry & Threat Surface Hardening"
      ],
      practicalApplication: "Constructed secure administrative web portals and real-time backend microservices with encrypted data pipelines.",
      skills: ["React / Next.js", "Node.js / Express", "PostgreSQL", "Tailwind CSS", "Security Auditing"],
      sortOrder: 3
    }
  ],

  experience: [
    {
      id: "exp-gdg",
      role: "Tech Lead & Core Organizer",
      company: "GDG AASTU",
      period: "2023 - Present",
      location: "Addis Ababa, Ethiopia",
      shortDesc: "Leading developer bootcamps, coordinating hackathons, and mentoring 200+ tech students.",
      fullDescription: "As Tech Lead at GDG AASTU, I spearhead university developer workshops, hands-on coding bootcamps, and technical speaker sessions. Coordinated multi-day hackathons and mentored student development teams building production web applications.",
      keyAchievements: [
        "Organized 12+ tech workshops on React, Node.js, and Cloud deployment.",
        "Mentored over 200 student developers across campus hackathons.",
        "Engineered community event registration systems with real-time analytics."
      ],
      tech: ["React", "Node.js", "Community Leadership", "Event Portals", "Git & GitHub"],
      sortOrder: 1
    },
    {
      id: "exp-ishub",
      role: "Software Developer Intern",
      company: "iSHUB Tech Solutions",
      period: "2023 - 2024",
      location: "Addis Ababa, Ethiopia",
      shortDesc: "Developing enterprise backend REST APIs, SQL database indexing, and client web dashboards.",
      fullDescription: "Contributed directly to client-facing web application development. Refactored Node.js Express backend API endpoints for accelerated payload delivery, optimized SQL database query execution times, and designed responsive client interfaces.",
      keyAchievements: [
        "Reduced SQL query latency by 25% through strategic indexing.",
        "Integrated JWT user authentication and RBAC authorization pipelines.",
        "Delivered pixel-perfect React interface components from Figma wireframes."
      ],
      tech: ["Node.js", "Express.js", "PostgreSQL", "React", "REST API", "JWT Auth"],
      sortOrder: 2
    },
    {
      id: "exp-insa",
      role: "Cybersecurity & Systems Specialist",
      company: "INSA",
      period: "2022 - 2023",
      location: "Addis Ababa, Ethiopia",
      shortDesc: "Security auditing, system log telemetry analysis, and network threat surface mitigation.",
      fullDescription: "Engaged in critical security auditing, system telemetry monitoring, and vulnerability assessments. Analyzed server event logs to identify operational anomalies, evaluated network perimeter defenses, and assisted in drafting server hardening policies.",
      keyAchievements: [
        "Analyzed server log streams to identify and remediate configuration bugs.",
        "Formulated baseline security guidelines for internal Linux server deployments.",
        "Monitored network telemetry traffic using Wireshark and protocol tools."
      ],
      tech: ["Network Security", "Linux Systems", "Log Telemetry", "Wireshark", "Threat Modeling"],
      sortOrder: 3
    },
    {
      id: "exp-gibi",
      role: "Full-Stack Developer",
      company: "Gibi Gubae Tech Team",
      period: "2022 - Present",
      location: "Addis Ababa, Ethiopia",
      shortDesc: "Engineering community event portals, member management databases, and notification services.",
      fullDescription: "Designed and built custom administrative web platforms for community management. Engineered web portals enabling team leaders to maintain member rosters, schedule upcoming events, and dispatch automated announcements.",
      keyAchievements: [
        "Built responsive web portals serving campus community members.",
        "Implemented automated event reminder pipelines and broadcast notifications.",
        "Designed database models ensuring high uptime during traffic surges."
      ],
      tech: ["React", "Tailwind CSS", "Firebase", "Node.js", "Cloud Firestore"],
      sortOrder: 4
    }
  ],

  projects: [
    {
      id: "proj-kuralew",
      title: "Digital Kuralew Platform",
      category: "Full-Stack Web App",
      shortDesc: "On-demand recyclables collection & waste management service platform.",
      fullDesc: "A web platform connecting households with urban recyclable waste collectors in real-time. Features interactive collection scheduling, geographical location tagging, automated pickup pricing estimates, and real-time status tracking for collectors.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
      architectureHighlights: [
        "Real-time geographical location mapping for pickup dispatch.",
        "Automated waste weight-to-price estimation calculator.",
        "Role-based portal for household users and municipal collection agents."
      ],
      tech: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "Google Maps API"],
      github: "https://github.com",
      live: "https://example.com",
      sortOrder: 1
    },
    {
      id: "proj-parking",
      title: "Parking Spot Finder API",
      category: "Backend & Microservices",
      shortDesc: "Smart urban parking spot reservation API with real-time sensor integration.",
      fullDesc: "A high-concurrency microservice backend for finding and reserving urban parking spaces. Ingests occupancy telemetry from simulated lot sensors, updates available spot counts in real-time via WebSockets, and manages reservation timeouts.",
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
      architectureHighlights: [
        "WebSocket server streaming live slot availability to mobile clients.",
        "Redis caching layer preventing race conditions during concurrent booking.",
        "Geospatial SQL queries searching available spots within a radius."
      ],
      tech: ["Node.js", "Express.js", "PostgreSQL", "Redis", "WebSockets"],
      github: "https://github.com",
      live: "https://example.com",
      sortOrder: 2
    },
    {
      id: "proj-telecare",
      title: "TeleCare+ Telemedicine Portal",
      category: "Full-Stack Web App",
      shortDesc: "Real-time doctor appointment booking & patient records management portal.",
      fullDesc: "A modern healthcare portal providing web-based doctor appointments, digital prescription storage, and secure patient-doctor messaging. Features high-encryption record storage compliant with medical privacy standards.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      architectureHighlights: [
        "Encrypted patient medical history record storage.",
        "Doctor calendar availability slot scheduler.",
        "Real-time consultation chat with file attachment support."
      ],
      tech: ["React", "Node.js", "MongoDB", "Express.js", "Tailwind CSS"],
      github: "https://github.com",
      live: "https://example.com",
      sortOrder: 3
    },
    {
      id: "proj-net-monitor",
      title: "CCTV & IP Network Telemetry",
      category: "Infrastructure & IoT",
      shortDesc: "Real-time enterprise network node tracking & IP camera uptime monitor.",
      fullDesc: "An infrastructure dashboard engineered for network operations centers (NOCs). Continuously pings network gateways, Hikvision NVR nodes, and IP cameras, outputting latency graphs and triggering automated offline alerts.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      architectureHighlights: [
        "Ping latency telemetry tracking with live Chart.js graphs.",
        "Instant WebSocket alerts when CCTV camera streams go offline.",
        "Network topology visual map showing active vs unreachable subnets."
      ],
      tech: ["React", "Node.js", "WebSockets", "HCIA Protocols", "Chart.js"],
      github: "https://github.com",
      live: "https://example.com",
      sortOrder: 4
    },
    {
      id: "proj-ecommerce",
      title: "E-Commerce Microservices Engine",
      category: "Backend & Microservices",
      shortDesc: "Scalable modular API with inventory control and payment webhooks.",
      fullDesc: "A decoupled backend service architecture built for high-throughput online store applications. Features decoupled services for user accounts, product catalogs, shopping cart sessions, and payment gateway webhooks.",
      image: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80",
      architectureHighlights: [
        "Microservice boundary separation for order processing and inventory.",
        "JWT token authentication with refresh token rotation.",
        "Automated transactional email receipts via Nodemailer."
      ],
      tech: ["Node.js", "Express.js", "PostgreSQL", "Docker", "JWT"],
      github: "https://github.com",
      live: "https://example.com",
      sortOrder: 5
    },
    {
      id: "proj-hik-calc",
      title: "Surveillance Storage & Bandwidth Calc",
      category: "Infrastructure & IoT",
      shortDesc: "Utility web app calculating CCTV video bitrate and HDD storage requirements.",
      fullDesc: "A technical web calculator designed for security installation engineers. Computes required NVR hard drive storage space and network bandwidth based on video codecs (H.265+, H.264), camera resolution, frame rates, and retention period.",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
      architectureHighlights: [
        "Mathematical bitrate estimations for H.265+, H.265, and H.264 compression.",
        "Visual breakdown of terabytes required per NVR camera channel.",
        "Exportable PDF summary reports for client installation proposals."
      ],
      tech: ["React", "Tailwind CSS", "JavaScript Math Engines"],
      github: "https://github.com",
      live: "https://example.com",
      sortOrder: 6
    }
  ],

  certificates: [
    {
      id: "cert-hcia",
      title: "Huawei Certified ICT Associate (HCIA) - Routing & Switching",
      issuer: "Huawei Technologies",
      date: "2023",
      certId: "HCIA-RS-2023-88491",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      description: "Demonstrates validated competence in enterprise routing protocols, switching architectures, IP addressing schemes, VLAN management, and Huawei VRP networking operating system configuration.",
      validatedSkills: [
        "Huawei Enterprise VRP OS Navigation",
        "OSPF Multi-Area Routing Implementation",
        "STP / RSTP Loop Prevention Protocols",
        "Enterprise Security ACLs & NAT Setup"
      ],
      credentialUrl: "https://huawei.com",
      sortOrder: 1
    },
    {
      id: "cert-hikvision",
      title: "Hikvision Certified Security Specialist (HCSS)",
      issuer: "Hikvision Academy",
      date: "2023",
      certId: "HCSS-SEC-2023-99201",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
      description: "Comprehensive professional certification covering digital IP camera installation, NVR/DVR storage setup, HikCentral VMS video management, and intelligent video analytics deployment.",
      validatedSkills: [
        "Digital IP Camera Configuration & ONVIF Setup",
        "NVR Hard Drive RAID Storage Allocation",
        "Intelligent Motion Detection & Thermal Analytics",
        "Hik-Connect Cloud Gateway Deployment"
      ],
      credentialUrl: "https://hikvision.com",
      sortOrder: 2
    },
    {
      id: "cert-gdg",
      title: "Full-Stack Software Engineering Mastery",
      issuer: "GDG AASTU Tech Academy",
      date: "2022",
      certId: "GDG-FS-2022-33102",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      description: "Advanced certification covering modern React application state management, Node.js Express backend routing, PostgreSQL relational database design, REST API security, and deployment practices.",
      validatedSkills: [
        "React Component Lifecycle & State Hooks",
        "Express RESTful API Design & Middleware",
        "PostgreSQL Relational Database Normalization",
        "Git Version Control & CI/CD Fundamentals"
      ],
      credentialUrl: "https://gdg.community.dev",
      sortOrder: 3
    },
    {
      id: "cert-cyber",
      title: "Cybersecurity Auditing & Systems Hardening",
      issuer: "INSA Technical Training",
      date: "2023",
      certId: "INSA-CYBER-2023-44120",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      description: "Specialized accreditation covering server security auditing, log telemetry stream inspection, perimeter firewall configuration, and Linux system security hardening.",
      validatedSkills: [
        "System Log Telemetry Inspection",
        "Linux Server Security Policy Hardening",
        "Network Perimeter Threat Assessment",
        "Vulnerability Mitigation Protocols"
      ],
      credentialUrl: "https://insa.gov.et",
      sortOrder: 4
    }
  ]
};

async function main() {
  console.log('🌱 Starting Prisma 6 Database Seed...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shanbeldires.com';
  const rawPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || 'Shanbel Dires',
      email: adminEmail,
      password: hashedPassword,
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Profile
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: DATA.profile,
    });
    console.log('✅ Profile seeded.');
  }

  // 3. Seed Social Channels
  for (const channel of DATA.socialChannels) {
    await prisma.socialChannel.upsert({
      where: { id: channel.id },
      update: channel,
      create: channel,
    });
  }
  console.log(`✅ ${DATA.socialChannels.length} Social channels seeded.`);

  // 4. Seed Specializations
  for (const spec of DATA.specializations) {
    await prisma.specialization.upsert({
      where: { id: spec.id },
      update: spec,
      create: spec,
    });
  }
  console.log(`✅ ${DATA.specializations.length} Specializations seeded.`);

  // 5. Seed Experience
  for (const exp of DATA.experience) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: exp,
      create: exp,
    });
  }
  console.log(`✅ ${DATA.experience.length} Experience roles seeded.`);

  // 6. Seed Projects
  for (const proj of DATA.projects) {
    await prisma.project.upsert({
      where: { id: proj.id },
      update: proj,
      create: proj,
    });
  }
  console.log(`✅ ${DATA.projects.length} Projects seeded.`);

  // 7. Seed Certificates
  for (const cert of DATA.certificates) {
    await prisma.certificate.upsert({
      where: { id: cert.id },
      update: cert,
      create: cert,
    });
  }
  console.log(`✅ ${DATA.certificates.length} Certificates seeded.`);

  console.log('🎉 Prisma 6 Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Prisma Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
