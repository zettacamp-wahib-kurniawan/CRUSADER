/*
        VERSI HIBRIDA FINAL (LMS + Social + Chat + Pages)
        - PERBAIKAN: Handler untuk Follow/Following List
    */
document.addEventListener("DOMContentLoaded", () => {
  // =================================================================
  //  BAGIAN 1: DATABASE STATIS & STATE
  // =================================================================

  // Database (data mentah)
  const db = {
    users: {
      u_wahib: {
        id: "u_wahib",
        name: "Wahib (Anda)",
        avatar: "https://i.pravatar.cc/150?img=11",
        title: "Frontend Developer",
        banner: "https://picsum.photos/id/1015/1000/250",
        erpData: { campus: "Zetta Jakarta", program: "Teknik Informatika" },
        hobbies: ["React", "CSS", "Hiking"],
      },
      u_alice: {
        id: "u_alice",
        name: "Alice Smith",
        avatar: "https://i.pravatar.cc/150?img=49",
        title: "Siswa",
        banner: "https://picsum.photos/id/10/1000/250",
        erpData: { campus: "Zetta Jakarta", program: "Sosiologi" },
        hobbies: ["Membaca", "Penelitian"],
      },
      u_prof_doe: {
        id: "u_prof_doe",
        name: "Prof. John Doe",
        avatar: "https://i.pravatar.cc/150?img=12",
        title: "Profesor Sosiologi",
        banner: "https://picsum.photos/id/1018/1000/250",
        erpData: { campus: "Zetta Jakarta" },
        hobbies: ["Data", "Sejarah"],
      },
      u_jerry: {
        id: "u_jerry",
        name: "Jerry (QA)",
        avatar: "https://i.pravatar.cc/150?img=7",
        title: "QA Engineer",
        banner: "https://picsum.photos/id/1025/1000/250",
        erpData: { campus: "Zetta Jakarta" },
        hobbies: ["Cypress", "Kopi"],
      },
      u_prof_react: {
        id: "u_prof_react",
        name: "Prof. Eve",
        avatar: "https://i.pravatar.cc/150?img=35",
        title: "Profesor CS",
      },
    },

    classes: {
      c1: {
        id: "c1",
        name: "Introduction to Sociology",
        profId: "u_prof_doe",
        icon: "https://i.imgur.com/gKx3b2j.png",
        banner: "#4A69E2", // Warna solid
      },
      c2: {
        id: "c2",
        name: "Advanced React",
        profId: "u_prof_react",
        icon: "https://i.imgur.com/gKx3b2j.png", // Ganti dengan ikon React jika ada
        banner: "#00D8FF", // Biru React
      },
      c3: {
        id: "c3",
        name: "QA Fundamentals",
        profId: "u_jerry", // Jerry juga ngajar
        icon: "https://i.imgur.com/gKx3b2j.png", // Ganti dengan ikon QA
        banner: "#3E9A4D", // Hijau
      },
    },

    posts: {
      p1_lecture: {
        type: "lecture",
        classId: "c1",
        title: "Online Lecture",
        time: "Today 9:00 AM A1 - 11:0 AM",
      },
      p2_discuss: {
        type: "discussion",
        classId: "c1",
        placeholder: "Start a discussion...",
      },
      p3_assignment: {
        type: "assignment",
        classId: "c1",
        userId: "u_prof_doe",
        time: "2h",
        content:
          "Please read the attached chapter and submit the assignment by tomorrow.",
        attachment: "Week 3 - Social Institutions.pdf",
        likeCount: 4,
        commentCount: 2,
        due: "Besok, 10 Nov 2025",
      },
      p4_status: {
        type: "status",
        userId: "u_jerry",
        time: "2h",
        content:
          'Baru saja selesai menguji coba fitur "Join Lecture". Bekerja dengan baik!',
        likeCount: 12,
        commentCount: 1,
      },
      p5_comment: {
        type: "comment",
        postId: "p3_assignment", // Balasan untuk tugas
        userId: "u_alice",
        time: "3h",
        content: "What are the main characteristics of social institutions?",
        likeCount: 6,
      },
      p6_comment: {
        type: "comment",
        postId: "p3_assignment",
        userId: "u_alice",
        time: "3h",
        content: "What are the main characteristics of social institutions?",
        likeCount: 0,
      },
      p7_assignment_react: {
        type: "assignment",
        classId: "c2",
        userId: "u_prof_react",
        time: "1d",
        content: "Buat custom hook untuk fetch data.",
        attachment: "Module 5 - Hooks.pdf",
        likeCount: 10,
        commentCount: 3,
        due: "12 Nov 2025",
      },
      p8_assignment_qa: {
        type: "assignment",
        classId: "c3",
        userId: "u_jerry",
        time: "1d",
        content: "Tulis test case untuk skenario login.",
        attachment: "Login Scenarios.docx",
        likeCount: 5,
        commentCount: 1,
        due: "11 Nov 2025",
      },
    },

    // Menentukan urutan item di feed
    feedOrder: [
      "p1_lecture",
      "p2_discuss",
      "p3_assignment",
      "p7_assignment_react",
      "p8_assignment_qa",
      "p4_status",
      "p5_comment",
      "replies_divider",
      "p6_comment",
    ],

    // Data Sosial (dari Mockup A)
    following: {
      u_wahib: ["u_alice", "u_jerry", "u_prof_react"],
      u_alice: ["u_wahib"],
      u_prof_doe: ["u_wahib"],
      u_jerry: ["u_wahib", "u_alice"],
      u_prof_react: ["u_wahib"],
    },

    // Data LMS
    enrollment: {
      u_wahib: ["c1", "c2", "c3"], // Kita terdaftar di SEMUA kelas
      u_alice: ["c1"],
    },

    // Data Chat
    chatMessages: {
      u_alice: [
        {
          sender: "u_alice",
          content: "Hei, lihat tugas sosiologi?",
          time: "10:00 AM",
        },
        {
          sender: "u_wahib",
          content: "Hei Alice! Iya, baru aja lihat. Lumayan juga ya.",
          time: "10:01 AM",
        },
        {
          sender: "u_alice",
          content: "Banget. Terutama bagian karakteristik institusi sosial.",
          time: "10:02 AM",
        },
      ],
      u_jerry: [
        {
          sender: "u_jerry",
          content: "Bro, build-nya udah di-deploy?",
          time: "11:00 AM",
        },
      ],
      u_prof_react: [
        {
          sender: "u_prof_react",
          content:
            "Tugas custom hook kamu bagus, tapi tolong tambahkan dependency array.",
          time: "09:00 AM",
        },
      ],
    },
  };

  // State (data yang bisa berubah)
  const state = {
    currentUser: "u_wahib",
    currentPage: "feed",
    currentProfileViewing: null,
    currentChatTarget: null,
    likedItems: ["p3_assignment"],
    replyingTo: null,
  };

  // =================================================================
  //  BAGIAN 2: ELEMEN DOM (CACHE)
  // =================================================================
  const elements = {
    // Halaman
    pageFeed: document.getElementById("page-feed"),
    pageProfile: document.getElementById("page-profile"),
    pageFollowList: document.getElementById("page-follow-list"),
    pageChat: document.getElementById("page-chat"),
    pageClasses: document.getElementById("page-classes"), // BARU
    pageAssignments: document.getElementById("page-assignments"), // BARU

    // Navigasi
    navProfileLink: document.getElementById("nav-profile-link"),
    navProfileAvatar: document.getElementById("nav-profile-avatar"),
    navLinks: document.querySelectorAll(".nav-link"),

    // Kontainer Halaman Feed
    feedContainer: document.getElementById("feed-container"),
    sidebarContainer: document.getElementById("sidebar-container"),

    // Kontainer Halaman Profil
    profileHeaderContainer: document.getElementById("profile-header-container"),
    profileInfoContainer: document.getElementById("profile-info-container"),
    profilePostsContainer: document.getElementById("profile-posts-container"),

    // Kontainer Halaman Follow List
    followListTitle: document.getElementById("follow-list-title"),
    followListContainer: document.getElementById("follow-list-container"),
    profileShortcutFollow: document.getElementById(
      "profile-shortcut-container-follow",
    ),

    // Kontainer Halaman Chat
    chatMainContainer: document.getElementById("chat-main-container"),
    chatSidebarContainer: document.getElementById("chat-sidebar-container"),

    // Kontainer Halaman Classes & Assignments (BARU)
    classesContainer: document.getElementById("classes-container"),
    assignmentsContainer: document.getElementById("assignments-container"),
    profileShortcutAssign: document.getElementById(
      "profile-shortcut-container-assign",
    ),
  };

  // =================================================================
  //  BAGIAN 3: FUNGSI RENDER (Menggambar UI)
  // =================================================================
  const render = {
    // --- Render Halaman Feed (Hibrida) ---
    feedPage: () => {
      utils.showPage("feed");
      const userFollowing = db.following[state.currentUser];
      const userEnrolled = db.enrollment[state.currentUser];
      let html = "";

      db.feedOrder.forEach((itemId) => {
        const post = db.posts[itemId];
        if (!post) {
          if (itemId === "replies_divider") html += render.divider("2 replies");
          return;
        }
        if (
          (post.type === "lecture" || post.type === "discussion") &&
          userEnrolled.includes(post.classId)
        ) {
          if (post.type === "lecture") html += render.lectureCard(post);
          if (post.type === "discussion") html += render.discussionCard(post);
        } else if (
          post.type === "assignment" &&
          userEnrolled.includes(post.classId)
        ) {
          html += render.assignmentCard(itemId, post);
        } else if (
          post.type === "status" &&
          (userFollowing.includes(post.userId) ||
            post.userId === state.currentUser)
        ) {
          html += render.statusCard(itemId, post);
        } else if (
          post.type === "comment" &&
          db.posts[post.postId] &&
          userEnrolled.includes(db.posts[post.postId].classId)
        ) {
          html += render.commentCard(itemId, post);
        }
      });
      elements.feedContainer.innerHTML = html;
      render.sidebarLMS(); // Tampilkan sidebar kelas
    },

    // --- Render Halaman Profil (Mockup A) ---
    profilePage: (userId) => {
      utils.showPage("profile");
      state.currentProfileViewing = userId;
      render.profileHeader(userId);
      render.profileInfo(userId);
      render.profilePosts(userId);
    },

    // --- Render Halaman Follow List (Mockup A) ---
    followListPage: (userId, type) => {
      utils.showPage("follow-list");
      state.currentProfileViewing = userId;
      render.profileShortcut(elements.profileShortcutFollow);
      const user = db.users[userId];
      let userList = [];
      if (type === "following") {
        elements.followListTitle.textContent = `Orang yang di-follow ${user.name}`;
        userList = db.following[userId].map((id) => db.users[id]);
      } else {
        elements.followListTitle.textContent = `Orang yang me-follow ${user.name}`;
        userList = utils.getFollowers(userId).map((id) => db.users[id]);
      }
      elements.followListContainer.innerHTML =
        userList.length === 0
          ? "<p>Tidak ada user.</p>"
          : userList.map(render.followListItem).join("");
    },

    // --- Render Halaman Chat ---
    chatPage: () => {
      utils.showPage("chat");
      if (!state.currentChatTarget) {
        state.currentChatTarget = db.following[state.currentUser][0] || null;
      }
      render.chatContactsList();
      render.chatWindow(state.currentChatTarget);
    },

    // --- Render Halaman Classes (BARU) ---
    classesPage: () => {
      utils.showPage("classes");
      const enrolled = db.enrollment[state.currentUser];
      const html = enrolled
        .map((classId) => {
          const aClass = db.classes[classId];
          const prof = db.users[aClass.profId];
          return `
                        <div class="class-card">
                            <div class="class-card-banner" style="background-color: ${aClass.banner};">
                                <h3>${aClass.name}</h3>
                                <span>${prof.name}</span>
                            </div>
                            <div class="class-card-info">
                                <img src="${prof.avatar}" alt="${prof.name}" class="avatar">
                                <span>${prof.title}</span>
                            </div>
                        </div>
                    `;
        })
        .join("");
      elements.classesContainer.innerHTML = html;
    },

    // --- Render Halaman Assignments (BARU) ---
    assignmentsPage: () => {
      utils.showPage("assignments");
      render.profileShortcut(elements.profileShortcutAssign); // Tampilkan shortcut

      const enrolled = db.enrollment[state.currentUser];
      const allAssignments = Object.values(db.posts).filter(
        (post) => post.type === "assignment" && enrolled.includes(post.classId),
      );

      let html = "";
      if (allAssignments.length === 0) {
        html = "<p>Tidak ada tugas.</p>";
      } else {
        allAssignments.forEach((post) => {
          const aClass = db.classes[post.classId];
          html += `
                            <div class="assignment-list-item">
                                <div class="assignment-info">
                                    <div class="post-header-icon"><i class='bx bxs-pen'></i></div>
                                    <div class="assignment-details">
                                        <p>${post.content}</p>
                                        <span>${aClass.name}</span>
                                    </div>
                                </div>
                                <div class="assignment-due">
                                    Tenggat: ${post.due}
                                </div>
                            </div>
                        `;
        });
      }
      elements.assignmentsContainer.innerHTML = html;
    },

    // --- Render Komponen Individual ---

    lectureCard: (post) => `
                <div class="card lecture-card" data-id="${post.id}">
                    <div class="lecture-icon"><i class='bx bxs-video'></i></div>
                    <div class="lecture-info">
                        <strong>${post.title}</strong>
                        <span>${post.time}</span>
                    </div>
                    <button class="btn btn-primary" id="join-lecture-btn">Join</button>
                </div>`,

    discussionCard: (post) => `
                 <div class="card start-discussion" id="create-post-btn">
                    ${post.placeholder}
                </div>`,

    assignmentCard: (postId, post) => {
      const author = db.users[post.userId];
      const isLiked = state.likedItems.includes(postId);
      return `
                    <div class="card post-card" data-id="${postId}">
                        <div class="post-header">
                            <div class="post-header-icon"><i class='bx bxs-pen'></i></div>
                            <div class="post-header-info">
                                <a href="#" class="profile-link" data-page="profile" data-userid="${author.id}">${author.name}</a>
                                <span class="post-time">${post.time}</span>
                            </div>
                            <a href="#" class="post-menu"><i class='bx bx-dots-horizontal-rounded'></i></a>
                        </div>
                        <div class="post-body">
                            <p>${post.content}</p>
                            <div class="post-attachment">
                                <i class='bx bxs-file-pdf'></i>
                                <span>${post.attachment}</span>
                            </div>
                            <div style="text-align: right; font-size: 0.9rem; color: #D93025; font-weight: 500;">
                                Tenggat: ${post.due}
                            </div>
                        </div>
                        <div class="post-actions">
                            <div class="action-item action-like ${isLiked ? "liked" : ""}" data-id="${postId}">
                                <i class='bx bxs-like'></i>
                                <span>${post.likeCount}</span>
                            </div>
                            <div class="action-item">
                                <i class='bx bxs-comment'></i>
                                <span>${post.commentCount} comments</span>
                            </div>
                        </div>
                    </div>`;
    },

    statusCard: (postId, post) => {
      const author = db.users[post.userId];
      const isLiked = state.likedItems.includes(postId);
      let replyBoxHtml =
        state.replyingTo === postId ? render.replyBox(postId) : "";

      return `
                    <div class="card status-card" data-id="${postId}">
                        <img src="${author.avatar}" alt="${author.name}" class="status-avatar profile-link" data-page="profile" data-userid="${author.id}">
                        <div class="status-content">
                            <div class="post-header">
                                <div class="post-header-info">
                                    <a href="#" class="profile-link" data-page="profile" data-userid="${author.id}">${author.name}</a>
                                    <span class="post-time">${post.time}</span>
                                </div>
                                <a href="#" class="post-menu"><i class='bx bx-dots-horizontal-rounded'></i></a>
                            </div>
                            <div class="post-body">
                                <p>${post.content}</p>
                            </div>
                            <div class="post-actions">
                                <div class="action-item action-like ${isLiked ? "liked" : ""}" data-id="${postId}">
                                    <i class='bx bxs-like'></i>
                                    <span>${post.likeCount}</span>
                                </div>
                                <div class="action-item action-reply" data-id="${postId}">
                                    <i class='bx bxs-share'></i>
                                    <span>Reply</span>
                                </div>
                            </div>
                            <div class="reply-container">${replyBoxHtml}</div>
                        </div>
                    </div>`;
    },

    commentCard: (commentId, comment) => {
      const author = db.users[comment.userId];
      const isLiked = state.likedItems.includes(commentId);
      let replyBoxHtml =
        state.replyingTo === commentId ? render.replyBox(commentId) : "";

      return `
                    <div class="card comment-card" data-id="${commentId}">
                        <img src="${author.avatar}" alt="${author.name}" class="comment-avatar profile-link" data-page="profile" data-userid="${author.id}">
                        <div class="comment-content">
                            <div class="post-header">
                                <div class="post-header-info">
                                    <a href="#" class="profile-link" data-page="profile" data-userid="${author.id}">${author.name}</a>
                                    <span class="post-time">${comment.time}</span>
                                </div>
                                <a href="#" class="post-menu"><i class='bx bx-dots-horizontal-rounded'></i></a>
                            </div>
                            <div class="post-body">
                                <p>${comment.content}</p>
                            </div>
                            <div class="post-actions">
                                <div class="action-item action-like ${isLiked ? "liked" : ""}" data-id="${commentId}">
                                    <i class='bx bxs-like'></i>
                                    <span>${comment.likeCount}</span>
                                </div>
                                <div class="action-item action-reply" data-id="${commentId}">
                                    <i class='bx bxs-share'></i>
                                    <span>Reply</span>
                                </div>
                            </div>
                            <div class="reply-container">${replyBoxHtml}</div>
                        </div>
                    </div>`;
    },

    divider: (text) =>
      `<div class="replies-divider"><span>${text}</span></div>`,

    replyBox: (commentId) => `
                <div class="reply-box">
                    <input type="text" id="reply-input-${commentId}" placeholder="Tulis balasan...">
                    <button class="reply-send-btn" data-id="${commentId}"><i class='bx bxs-send'></i></button>
                </div>`,

    sidebarLMS: () => {
      const classId = db.enrollment[state.currentUser][0];
      const aClass = db.classes[classId];
      const prof = db.users[aClass.profId];
      elements.sidebarContainer.innerHTML = `
                    <div class="card class-info-card">
                        <div class="class-info-header">
                            <img src="${aClass.icon}" alt="" class="class-info-icon">
                            <strong>${aClass.name}</strong>
                            <span>${prof.name}</span>
                        </div>
                        <div class="class-info-body">
                            <strong>Materials</strong>
                            <ul class="materials-list">
                                <li><i class='bx bxs-file'></i> Lecture Notes</li>
                                <li><i class='bx bxs-book-open'></i> Readings</li>
                                <li><i class='bx bxs-layer'></i> Resources</li>
                            </ul>
                        </div>
                    </div>`;
    },

    // --- Komponen Halaman Profil (Mockup A) ---
    profileHeader: (userId) => {
      const user = db.users[userId];
      const isCurrentUser = userId === state.currentUser;
      const isFollowing = db.following[state.currentUser].includes(userId);
      const followers = utils.getFollowers(userId);
      let actionButton = "";
      if (isCurrentUser) {
        actionButton = '<button class="btn btn-secondary">Edit Profil</button>';
      } else if (isFollowing) {
        actionButton = `<button class="btn btn-secondary follow-btn" data-id="${userId}">Unfollow</button>`;
      } else {
        actionButton = `<button class="btn btn-primary follow-btn" data-id="${userId}">Follow</button>`;
      }
      elements.profileHeaderContainer.innerHTML = `
                    <div class="profile-header">
                        <img src="${user.banner}" alt="Banner" class="profile-header-banner">
                        <div class="profile-header-content">
                            <img src="${user.avatar}" alt="${user.name}" class="profile-header-avatar">
                            <div class="profile-header-info">
                                <h1>${user.name}</h1>
                                <p>${user.title}</p>
                                <div class="profile-header-stats">
                                    <a href="#" class="follow-link" data-page="follow" data-userid="${userId}" data-type="following">
                                        <strong>${db.following[userId].length}</strong> Following
                                    </a>
                                    <a href="#" class="follow-link" data-page="follow" data-userid="${userId}" data-type="followers">
                                        <strong>${followers.length}</strong> Followers
                                    </a>
                                </div>
                            </div>
                            <div class="profile-header-actions">
                                ${actionButton}
                            </div>
                        </div>
                    </div>`;
    },
    profileInfo: (userId) => {
      const user = db.users[userId];
      elements.profileInfoContainer.innerHTML = `
                    <div class="card profile-info-card">
                        <h3>Info</h3>
                        <ul>
                            <li><strong>Kampus (dari ERP)</strong> ${user.erpData.campus || "N/A"}</li>
                            <li><strong>Program (dari ERP)</strong> ${user.erpData.program || "N/A"}</li>
                        </ul>
                        <h3>Minat & Hobi</h3>
                        <div class="hobbies-list">
                            ${user.hobbies.map((hobby) => `<span>${hobby}</span>`).join("") || "Belum ada hobi."}
                        </div>
                    </div>`;
    },
    profilePosts: (userId) => {
      const userPosts = Object.values(db.posts).filter(
        (post) => post.type === "status" && post.userId === userId,
      );
      let html = "";
      if (userPosts.length === 0) {
        html = '<div class="card"><p>Belum ada postingan status.</p></div>';
      } else {
        userPosts.forEach((post) => {
          const postId = Object.keys(db.posts).find(
            (key) => db.posts[key] === post,
          );
          html += render.statusCard(postId, post);
        });
      }
      elements.profilePostsContainer.innerHTML = html;
    },

    // --- Komponen Halaman Follow List (Mockup A) ---
    followListItem: (user) => {
      const isFollowing = db.following[state.currentUser].includes(user.id);
      let buttonHtml = "";
      if (user.id !== state.currentUser) {
        buttonHtml = isFollowing
          ? `<button class="btn btn-secondary btn-sm follow-btn" data-id="${user.id}">Unfollow</button>`
          : `<button class="btn btn-primary btn-sm follow-btn" data-id="${user.id}">Follow</button>`;
      }
      return `
                    <div class="follow-list-item">
                        <div class="follow-list-info">
                            <img src="${user.avatar}" alt="${user.name}" class="avatar profile-link" data-page="profile" data-userid="${user.id}">
                            <div>
                                <a href="#" class="profile-link" data-page="profile" data-userid="${user.id}">${user.name}</a>
                                <div class="post-time">${user.title}</div>
                            </div>
                        </div>
                        ${buttonHtml}
                    </div>`;
    },
    profileShortcut: (container) => {
      const user = db.users[state.currentUser];
      container.innerHTML = `
                    <div class="card">
                        <a href="#" class="profile-link" data-page="profile" data-userid="${user.id}">
                            <div style="display: flex; align-items: center;">
                                <img src="${user.avatar}" alt="${user.name}" class="avatar">
                                <div class="profile-shortcut-info">
                                    <strong>${user.name}</strong>
                                    <span>${user.title}</span>
                                </div>
                            </div>
                        </a>
                    </div>`;
    },

    // --- Komponen Halaman Chat ---
    chatContactsList: () => {
      const contacts = db.following[state.currentUser].map(
        (id) => db.users[id],
      );
      let html = "<h3>Pesan</h3>";
      contacts.forEach((user) => {
        const isActive = user.id === state.currentChatTarget;
        const lastMessage = db.chatMessages[user.id]?.slice(-1)[0] || {
          content: "Mulai percakapan...",
        };
        html += `
                        <div class="chat-contact-item ${isActive ? "active" : ""}" data-page="chat-contact" data-userid="${user.id}">
                            <img src="${user.avatar}" alt="${user.name}" class="avatar">
                            <div class="chat-contact-info">
                                <strong>${user.name}</strong>
                                <span>${lastMessage.content}</span>
                            </div>
                        </div>
                    `;
      });
      elements.chatSidebarContainer.innerHTML = `<div class="card chat-contacts-list">${html}</div>`;
    },
    chatWindow: (userId) => {
      if (!userId) {
        elements.chatMainContainer.innerHTML =
          '<div class="card"><p>Pilih kontak untuk memulai chat.</p></div>';
        return;
      }
      const user = db.users[userId];
      const messages = db.chatMessages[userId] || [];
      let messagesHtml = "";
      messages.forEach((msg) => {
        const type = msg.sender === state.currentUser ? "sent" : "received";
        messagesHtml += `
                        <div class="chat-message ${type}">
                            <p>${msg.content}</p>
                        </div>
                    `;
      });
      elements.chatMainContainer.innerHTML = `
                    <div class="chat-window">
                        <div class="chat-header">
                            <img src="${user.avatar}" alt="${user.name}" class="avatar">
                            <strong>${user.name}</strong>
                        </div>
                        <div class="chat-messages" id="chat-messages-container">
                            ${messagesHtml}
                        </div>
                        <div class="chat-input-area">
                            <input type="text" id="chat-input" placeholder="Ketik pesan...">
                            <button id="chat-send-btn"><i class='bx bxs-send'></i></button>
                        </div>
                    </div>
                `;
      const msgContainer = document.getElementById("chat-messages-container");
      if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    },
  };

  // =================================================================
  //  BAGIAN 4: HANDLER INTERAKSI (Logika Aksi)
  // =================================================================
  const handlers = {
    // Navigasi diklik
    navClick: (e) => {
      e.preventDefault();
      const target = e.currentTarget;
      const page = target.dataset.page;

      elements.navLinks.forEach((item) => item.classList.remove("active"));
      if (target.classList.contains("nav-link")) {
        target.classList.add("active");
      }

      if (page === "feed") {
        render.feedPage();
      } else if (page === "profile") {
        const userId = target.dataset.userid || state.currentUser;
        render.profilePage(userId);
      } else if (page === "chat") {
        render.chatPage();
      } else if (page === "classes") {
        // BARU
        render.classesPage();
      } else if (page === "assignments") {
        // BARU
        render.assignmentsPage();
      }
    },

    // Klik link follow list
    followLinkClick: (target) => {
      // PERBAIKAN: Menerima 'target' bukan 'e'
      // e.preventDefault(); // Sudah dilakukan di listener
      const userId = target.dataset.userid;
      const type = target.dataset.type;
      render.followListPage(userId, type);
    },

    // Tombol "Join" diklik
    joinClick: () => {
      alert("Bergabung dengan kuliah online...");
    },

    // Tombol "Like" diklik
    likeClick: (target) => {
      const itemId = target.dataset.id;
      const post = db.posts[itemId];
      if (state.likedItems.includes(itemId)) {
        state.likedItems = state.likedItems.filter((id) => id !== itemId);
        if (post) post.likeCount--;
      } else {
        state.likedItems.push(itemId);
        if (post) post.likeCount++;
      }
      utils.rerenderCurrentPage();
    },

    // Tombol "Reply" diklik
    replyClick: (target) => {
      const commentId = target.dataset.id;
      state.replyingTo = state.replyingTo === commentId ? null : commentId;
      utils.rerenderCurrentPage();
    },

    // Tombol "Send Reply" diklik
    sendReplyClick: (target) => {
      const commentId = target.dataset.id;
      const input = document.getElementById(`reply-input-${commentId}`);
      const content = input.value.trim();
      if (content === "") return;

      const newReplyId = "p" + (Object.keys(db.posts).length + 1);
      db.posts[newReplyId] = {
        type: "comment",
        postId: commentId,
        userId: state.currentUser,
        time: "Just now",
        content: content,
        likeCount: 0,
      };
      const originalPostIndex = db.feedOrder.indexOf(commentId);
      db.feedOrder.splice(originalPostIndex + 1, 0, newReplyId);
      state.replyingTo = null;
      render.feedPage();
    },

    // Tombol "Follow/Unfollow" diklik
    followClick: (target) => {
      const userIdToToggle = target.dataset.id;
      const followingList = db.following[state.currentUser];
      const isFollowing = followingList.includes(userIdToToggle);
      if (isFollowing) {
        db.following[state.currentUser] = followingList.filter(
          (id) => id !== userIdToToggle,
        );
      } else {
        db.following[state.currentUser].push(userIdToToggle);
      }
      utils.rerenderCurrentPage();
    },

    // Klik "Start a discussion"
    createPostClick: () => {
      const content = prompt("Tulis status barumu:");
      if (!content || content.trim() === "") return;

      const newPostId = "p_status_" + (Object.keys(db.posts).length + 1);
      db.posts[newPostId] = {
        type: "status",
        userId: state.currentUser,
        time: "Just now",
        content: content,
        likeCount: 0,
        commentCount: 0,
      };
      db.feedOrder.splice(2, 0, newPostId);
      render.feedPage();
    },

    // --- Handler Chat ---
    chatContactClick: (target) => {
      const userId = target.dataset.userid;
      state.currentChatTarget = userId;
      render.chatContactsList(); // Render ulang sidebar chat
      render.chatWindow(userId); // Render ulang jendela chat
    },

    chatSendClick: () => {
      const input = document.getElementById("chat-input");
      const content = input.value.trim();
      if (content === "" || !state.currentChatTarget) return;
      const targetId = state.currentChatTarget;
      const newMessage = {
        sender: state.currentUser,
        content: content,
        time: "Just now",
      };
      if (!db.chatMessages[targetId]) {
        db.chatMessages[targetId] = [];
      }
      db.chatMessages[targetId].push(newMessage);
      render.chatWindow(targetId); // Hanya render ulang jendela chat
      render.chatContactsList(); // Render ulang kontak (untuk update pesan terakhir)
      input.value = "";
    },
  };

  // =================================================================
  //  BAGIAN 5: INISIALISASI (Event Listeners)
  // =================================================================
  const init = () => {
    // Update info profil di nav
    elements.navProfileLink.dataset.userid = state.currentUser;
    elements.navProfileAvatar.src = db.users[state.currentUser].avatar;

    // Listener untuk navigasi
    elements.navLinks.forEach((link) => {
      link.addEventListener("click", handlers.navClick);
    });
    elements.navProfileLink.addEventListener("click", handlers.navClick);

    // Listener global untuk semua aksi
    document.body.addEventListener("click", (e) => {
      const target = e.target;

      // --- Link Navigasi Internal ---
      const profileLink = target.closest(
        ".profile-link, .comment-avatar, .status-avatar",
      );
      if (profileLink) {
        e.preventDefault();
        render.profilePage(profileLink.dataset.userid);
        return;
      }
      const followLink = target.closest(".follow-link");
      if (followLink) {
        e.preventDefault();
        handlers.followLinkClick(followLink); // PERBAIKAN: Kirim 'followLink' bukan 'e'
        return;
      }

      // --- Aksi Halaman Chat ---
      const chatContact = target.closest('[data-page="chat-contact"]');
      if (chatContact) {
        e.preventDefault();
        handlers.chatContactClick(chatContact);
        return;
      }
      const chatSendBtn = target.closest("#chat-send-btn");
      if (chatSendBtn) {
        e.preventDefault();
        handlers.chatSendClick();
        return;
      }

      // --- Tombol Aksi Lainnya ---
      const actionTarget = target.closest(
        "button, .action-item, .start-discussion",
      );
      if (!actionTarget) return;
      if (actionTarget.id === "join-lecture-btn") handlers.joinClick();
      if (actionTarget.id === "create-post-btn") handlers.createPostClick();
      if (actionTarget.classList.contains("action-like"))
        handlers.likeClick(actionTarget);
      if (actionTarget.classList.contains("action-reply"))
        handlers.replyClick(actionTarget);
      if (actionTarget.classList.contains("reply-send-btn"))
        handlers.sendReplyClick(actionTarget);
      if (actionTarget.classList.contains("follow-btn"))
        handlers.followClick(actionTarget);
    });

    // Listener untuk Enter di input chat
    document.body.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.target.id === "chat-input") {
        e.preventDefault();
        handlers.chatSendClick();
      }
    });

    // --- Render Awal ---
    render.feedPage();
  };

  // =================================================================
  //  BAGIAN 6: UTILITIES
  // =================================================================
  const utils = {
    // Fungsi untuk pindah halaman
    showPage: (pageId) => {
      state.currentPage = pageId;
      // Sembunyikan semua halaman
      elements.pageFeed.style.display = "none";
      elements.pageProfile.style.display = "none";
      elements.pageFollowList.style.display = "none";
      elements.pageChat.style.display = "none";
      elements.pageClasses.style.display = "none"; // BARU
      elements.pageAssignments.style.display = "none"; // BARU

      // Tampilkan halaman yang benar
      if (pageId === "feed") elements.pageFeed.style.display = "flex";
      if (pageId === "profile") elements.pageProfile.style.display = "block";
      if (pageId === "follow-list")
        elements.pageFollowList.style.display = "flex";
      if (pageId === "chat") elements.pageChat.style.display = "flex";
      if (pageId === "classes") elements.pageClasses.style.display = "block"; // BARU
      if (pageId === "assignments")
        elements.pageAssignments.style.display = "flex"; // BARU
    },

    // Fungsi untuk menghitung followers
    getFollowers: (userId) => {
      const followers = [];
      for (const followerId in db.following) {
        if (db.following[followerId].includes(userId)) {
          followers.push(followerId);
        }
      }
      return followers;
    },

    // Fungsi untuk me-render ulang halaman saat ini (setelah follow/like)
    rerenderCurrentPage: () => {
      if (state.currentPage === "feed") {
        render.feedPage();
      } else if (state.currentPage === "profile") {
        render.profilePage(state.currentProfileViewing);
      } else if (state.currentPage === "follow-list") {
        const type = elements.followListTitle.textContent.includes("di-follow")
          ? "following"
          : "followers";
        render.followListPage(state.currentProfileViewing, type);
      } else if (state.currentPage === "chat") {
        render.chatPage();
      } else if (state.currentPage === "classes") {
        render.classesPage();
      } else if (state.currentPage === "assignments") {
        render.assignmentsPage();
      }
    },
  };

  // Jalankan aplikasi
  init();
});
