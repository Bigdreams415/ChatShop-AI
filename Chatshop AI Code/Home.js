document.addEventListener('DOMContentLoaded', function () {
    var features = document.querySelectorAll('.features');
    var options = {
        threshold: 0.001
    };

    var observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    features.forEach(feature => {
        observer.observe(feature);
    });
});