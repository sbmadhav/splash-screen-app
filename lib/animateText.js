window.animateText = function animateText(showText) {
  if (!showText) return
  /**
   * The element containing the text to be animated.
   * @type {HTMLElement}
   */
  var textWrapper = document.querySelector(".ml12")

  if (!textWrapper) return

  /**
   * Splits text into words and wraps each word's characters in spans
   * while preserving word boundaries for proper wrapping.
   */
  const words = textWrapper.textContent.trim().split(/\s+/)
  textWrapper.innerHTML = words.map(word => {
    const letters = word.replace(/\S/g, "<span class='letter'>$&</span>")
    return `<span class="word">${letters}</span>`
  }).join(' ')

  // Declare the anime variable before using it
  const anime = window.anime

  /**
   * Creates an animation timeline using the anime.js library.
   * @type {anime.timeline}
   */
  anime
    .timeline({ loop: true })
    .add({
      targets: ".ml12 .letter",
      translateX: [40, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1200,
      delay: (el, i) => 500 + 30 * i,
    })
    .add({
      targets: ".ml12 .letter",
      translateX: [0, -30],
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 1100,
      delay: (el, i) => 100 + 30 * i,
    })
}
