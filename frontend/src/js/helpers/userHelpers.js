export function getUsername() {
    const userToken = sessionStorage.getItem('usertoken');
    return userToken.substring(userToken.indexOf('.') + 1);
}

export function getUserId() {
    const userToken = sessionStorage.getItem('usertoken');
    return userToken.substring(0, userToken.indexOf('.'));
}