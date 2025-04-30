// minimum 8 chars, au moins 1 majuscule, 1 chiffre, 1 special
export const PASS_REGEX = /^(?=.{8,}$)(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).*$/;
// forme basique de email (xxx@yyy.zzz)
export const EMAIL_REGEX = /^[\w.-]+@([\w-]+\.)+[A-Za-z]{2,}$/;
