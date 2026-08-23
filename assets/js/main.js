(function() {
	"use strict";

	// Function to handle header shrink on scroll
	function handleHeaderScroll() {
		const header = document.querySelector('header');
		if (header) {
			if (window.scrollY > 50) {
				header.classList.add('scrolled');
			} else {
				header.classList.remove('scrolled');
			}
		}
	}

	window.addEventListener('scroll', handleHeaderScroll);

	document.addEventListener('DOMContentLoaded', function() {

		// Mobile Menu Toggle
		const mobileMenuButton = document.querySelector('.mobile-menu');
		const nav = document.querySelector('nav');

		if (mobileMenuButton && nav) {
			const menuIcon = mobileMenuButton.querySelector('i');
			mobileMenuButton.setAttribute('aria-expanded', 'false');

			mobileMenuButton.addEventListener('click', function() {
				nav.classList.toggle('active');
				mobileMenuButton.setAttribute('aria-expanded', String(nav.classList.contains('active')));
				if (menuIcon) {
					menuIcon.classList.toggle('fa-bars');
					menuIcon.classList.toggle('fa-times');
				}
			});
		}

		// Active Navigation Link
		const currentLocation = window.location.href;
		const navLinks = document.querySelectorAll('nav a');
		navLinks.forEach(link => {
			if (link.href === currentLocation) {
				link.classList.add('active');
			}
		});

		// Fade-in on Scroll Animation
		const sections = document.querySelectorAll('section');

		// Add the class to all sections initially
		sections.forEach(section => {
			section.classList.add('fade-in-section');
		})

		const observerOptions = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1
		};

		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					// Optional: unobserve the element after it's visible
					// observer.unobserve(entry.target);
				} else {
					// Optional: remove class if you want the animation to repeat
					// entry.target.classList.remove('is-visible');
				}
			});
		}, observerOptions);

		sections.forEach(section => {
			observer.observe(section);
		});

		// Contact Form Validation
		const contactForm = document.getElementById('contact-form');
		if (contactForm) {
			const formStatus = document.createElement('div');
			formStatus.className = 'form-status';
			contactForm.parentNode.insertBefore(formStatus, contactForm.nextSibling);

			contactForm.addEventListener('submit', function(e) {
				e.preventDefault();
				
				if (validateForm()) {
					const formData = new FormData(contactForm);
					const submitButton = contactForm.querySelector('button[type="submit"]');
					const originalButtonText = submitButton.textContent;
					
					submitButton.disabled = true;
					submitButton.textContent = 'Sending...';

					fetch(contactForm.action, {
						method: 'POST',
						body: formData,
						headers: {
							'Accept': 'application/json'
						}
					}).then(response => {
						if (response.ok) {
							formStatus.textContent = 'Thanks for your message! We will get back to you shortly.';
							formStatus.className = 'form-status success';
							contactForm.reset();
						} else {
							response.json().then(data => {
								if (Object.hasOwn(data, 'errors')) {
									formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
								} else {
									formStatus.textContent = 'Oops! There was a problem submitting your form.';
								}
								formStatus.className = 'form-status error';
							})
						}
					}).catch(error => {
						formStatus.textContent = 'Oops! There was a problem submitting your form.';
						formStatus.className = 'form-status error';
					}).finally(() => {
						submitButton.disabled = false;
						submitButton.textContent = originalButtonText;
					});
				}
			});

			const validateForm = () => {
				let isValid = true;
				const requiredFields = contactForm.querySelectorAll('[required]');
				
				requiredFields.forEach(field => {
					const errorElement = field.nextElementSibling && field.nextElementSibling.classList.contains('error-message') ? field.nextElementSibling : document.createElement('span');
					if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
						errorElement.className = 'error-message';
						field.parentNode.insertBefore(errorElement, field.nextSibling);
					}

					if (field.value.trim() === '') {
						isValid = false;
						field.classList.add('invalid');
						errorElement.textContent = 'This field is required.';
					} else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) {
						isValid = false;
						field.classList.add('invalid');
						errorElement.textContent = 'Please enter a valid email address.';
					} else {
						field.classList.remove('invalid');
						errorElement.textContent = '';
					}
				});
				return isValid;
			}
		}
	});

})();
