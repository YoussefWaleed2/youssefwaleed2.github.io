/**
 * Utility to manually toggle the person-bg class for navbar styling
 * Add this class when a person appears in the background
 */

/**
 * Add the person background styling to the navbar
 * Call this when a person is shown in the background
 */
export const enablePersonBackground = () => {
  document.body.classList.add('person-bg');
};

/**
 * Remove the person background styling from the navbar
 * Call this when no person is in the background
 */
export const disablePersonBackground = () => {
  document.body.classList.remove('person-bg');
};

/**
 * Toggle the person background styling
 * @param {boolean} isPersonVisible - Whether a person is visible in the background
 */
export const togglePersonBackground = (isPersonVisible) => {
  if (isPersonVisible) {
    enablePersonBackground();
  } else {
    disablePersonBackground();
  }
}; 