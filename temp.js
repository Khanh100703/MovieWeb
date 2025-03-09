let nav = document.querySelectorAll(".nav-item")


for (let i = 0; i < nav.length; i++) {
    nav[i].onclick = function () {
        let j = 0;
        while (j < nav.length) {
            nav[j++].className = 'nav-item'
        }
        nav[i].className = 'nav-item active'
    }
}

// MOBILE MENU 

let menu_tablet = document.querySelector('.menu-tablet')
let menu_toggle = document.querySelector('.menu-toggle')

menu_toggle.onclick = function () {
    menu_toggle.classList.toggle('active')
    menu_tablet.classList.toggle('active')
}


// SLIDE

let big_slider = document.querySelector("#big-slider")


let big_slide_index = 0

let slide_play = true




let header = document.querySelector(".nav")

showSlide = (index) => {
    big_slider.querySelector(".big-slide-item.active").classList.remove('active')
    big_slide_items[index].classList.add('active')
}



prevSlide = () => {
    big_slide_index = big_slide_index - 1 < 0 ? big_slide_items.length - 1 : big_slide_index - 1
    showSlide(big_slide_index)

}





window.addEventListener("scroll", () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        header.classList.add("shrink")
    } else {
        header.classList.remove('shrink')
    }
})




let scroll = window.requestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
}

let el_to_show = document.querySelectorAll('.show-on-scroll');

isElInViewPort = (el) => {
    let rect = el.getBoundingClientRect();

    let distance = 200;

    return rect.top <= (window.innerHeight - distance || document.documentElement.clientHeight - distance);

}

loop = () => {
    el_to_show.forEach(el => {
        if (isElInViewPort(el))
            el.classList.add('show');
    })
    scroll(loop)
}

loop();


// PROGRESS BAR

let scrollPrecentage = () => {
    let scrollProgress = document.getElementById('progress-bar')
    let progressVal = document.getElementById("progress-val")
    let pos = document.documentElement.scrollTop
    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    let scrollVal = Math.round(pos * 100 / calcHeight)
    scrollProgress.style.background = `conic-gradient(#e70634 ${scrollVal}%, #2b2f38 ${scrollVal}%)`
}

window.onscroll = scrollPrecentage
window.onload = scrollPrecentage


//   MOBILE NAV

var list = document.querySelectorAll('.item')

function activeLink() {
    list.forEach((item) => item.classList.remove('active'))
    this.classList.add('active')
}

list.forEach((item) => item.addEventListener('click', activeLink))

document.addEventListener("DOMContentLoaded", function () {
    let loggedInUser = localStorage.getItem("loggedInUser");
    let navSign = document.querySelector(".nav-sign");

    if (navSign) { // Kiểm tra nếu có phần tử nav-sign trên trang
        if (loggedInUser) {
            navSign.innerHTML = `
                <span>Xin chào, <strong>${loggedInUser}</strong></span>
                <button id="logout-btn" style="background: none; color: #ff4500; border: none; cursor: pointer;">Đăng Xuất</button>
            `;

            document.getElementById("logout-btn").addEventListener("click", function () {
                localStorage.removeItem("loggedInUser");
                location.reload();
            });
        }
    }
});



// FAVORITE FEATURE



document.addEventListener("DOMContentLoaded", function () {
    let loggedInUser = localStorage.getItem("loggedInUser");
    let favoriteMovies = JSON.parse(localStorage.getItem(`favorites_${loggedInUser}`)) || [];
    let moviesPerPage = 6; // Số phim hiển thị ban đầu
    let currentPage = 1;

    const updateFavoriteSection = () => {
        let favoriteSection = document.getElementById("favorite-section");
        if (!favoriteSection) return;

        let sectionWrapper = favoriteSection.querySelector(".section-wrapper");
        if (!sectionWrapper) return;

        sectionWrapper.innerHTML = '<div class="section-header"><span>Favorite Movies</span></div>';

        if (favoriteMovies.length === 0) {
            sectionWrapper.innerHTML += "<p>Không có phim yêu thích nào.</p>";
            return;
        }

        let movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-list");

        let displayedMovies = favoriteMovies.slice(0, currentPage * moviesPerPage);
        movieContainer.innerHTML = displayedMovies.map(movie => `
            <div class="movie-item">
                <img src="${movie.image}" alt="${movie.title}">
                <div class="movie-item-content">
                    <div class="movie-item-title">${movie.title}</div>
                    <i class='bx bxs-heart remove-favorite favorited' data-title="${movie.title}"></i>
                </div>
            </div>
        `).join("");

        movieContainer.style.display = "grid";
        movieContainer.style.display = "component";
        movieContainer.style.display = "style";
        movieContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(400px, 10fr))";
        movieContainer.style.gap = "15px";

        sectionWrapper.appendChild(movieContainer);

        let existingLoadMore = sectionWrapper.querySelector("btn-load");
        if (existingLoadMore) existingLoadMore.remove();

        if (favoriteMovies.length > displayedMovies.length) {
            let loadMoreBtn = document.createElement("button");
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.add("btn-load");
            loadMoreBtn.addEventListener("click", function () {
                currentPage++;
                updateFavoriteSection();
            });
            sectionWrapper.appendChild(loadMoreBtn);
        }

        document.querySelectorAll(".remove-favorite").forEach(button => {
            button.addEventListener("click", function () {
                let title = this.getAttribute("data-title");
                favoriteMovies = favoriteMovies.filter(movie => movie.title !== title);
                localStorage.setItem(`favorites_${loggedInUser}`, JSON.stringify(favoriteMovies));
                updateHeartIcons();
                updateFavoriteSection();
            });
        });
    };

    const updateHeartIcons = () => {
        document.querySelectorAll(".bxs-heart").forEach(button => {
            let movieElement = button.closest(".movie-item");
            let movieTitle = movieElement.querySelector(".movie-item-title").innerText;

            if (favoriteMovies.some(m => m.title === movieTitle)) {
                button.classList.add("favorited"); // Thêm màu khi đã thích
            } else {
                button.classList.remove("favorited"); // Xóa màu khi bỏ thích
            }
        });
    };

    document.querySelectorAll(".bxs-heart").forEach(button => {
        button.addEventListener("click", function () {
            if (!loggedInUser) {
                alert("Bạn cần đăng nhập để thêm vào yêu thích!");
                return;
            }

            let movieElement = button.closest(".movie-item");
            let movie = {
                title: movieElement.querySelector(".movie-item-title").innerText,
                image: movieElement.querySelector("img").src
            };

            if (!favoriteMovies.some(m => m.title === movie.title)) {
                favoriteMovies.push(movie);
            } else {
                favoriteMovies = favoriteMovies.filter(m => m.title !== movie.title);
            }

            localStorage.setItem(`favorites_${loggedInUser}`, JSON.stringify(favoriteMovies));
            updateHeartIcons();
            updateFavoriteSection();
        });
    });

    updateHeartIcons();
    updateFavoriteSection();
});

document.querySelectorAll(".movie-item").forEach(movie => {
    movie.addEventListener("click", function (event) {
        // Kiểm tra nếu click vào nút "bxs-right-arrow", thì cho phép chuyển trang
        if (event.target.classList.contains("bxs-right-arrow")) {
            window.location.href = this.href; // Chuyển đến trang component.html
        } else {
            event.preventDefault(); // Ngăn không cho chuyển trang nếu không phải bấm vào icon
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const sections = {
        home: document.querySelector(".big-section"),
        trending: document.querySelector("#latest-section"),
        tvSeries: document.querySelector("#section-tv"),
        hotmovie: document.querySelector("#hot-section"),
        favorite: document.querySelector("#favorite-section")
    };

    const menuItems = {
        home: document.querySelector(".nav-item a[href='#']"),
        trending: document.querySelector(".nav-item a[href='#latest-section']"),
        tvSeries: document.querySelector(".nav-item a[href='#section-tv']"),
        hotmovie: document.querySelector(".nav-item a[href='#hot-section']"),
        favorite: document.querySelector(".nav-item a[href='#favorite-section']")
    };

    function updateActiveMenu() {
        let scrollPosition = window.scrollY + window.innerHeight / 3;

        for (const key in sections) {
            if (sections[key]) {
                let sectionTop = sections[key].offsetTop;
                let sectionHeight = sections[key].offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
                    if (menuItems[key]) {
                        menuItems[key].parentElement.classList.add("active");
                    }
                }
            }
        }
    }

    window.addEventListener("scroll", updateActiveMenu);
    updateActiveMenu(); // Gọi lần đầu khi trang load
});

self.addEventListener('fetch', event => {
    if (event.preloadResponse) {
        event.respondWith(
            (async () => {
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }
                return fetch(event.request); // Nếu không có preloadResponse, lấy từ mạng
            })()
        );
    }
});

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            if ('navigationPreload' in self.registration) {
                await self.registration.navigationPreload.disable();
            }
        })()
    );
});







