import http from "../http-common.js";

class UserDataService {
  // getAll() {
  //   return http.get("/users");
  // }

  // get(id) {
  //   return http.get(`/users/${id}`);
  // }

  create(data) {
    console.log("inside UserDataService.js create()")
    return http.post("/users/create", data);
  }

  findAllUsers() {
    console.log("inside UserDataService.js findAllUsers()")
    return http.get(`/users/findAllUsers`);
  }

  findByUsername(username) {
    console.log("inside UserDataService.js findByUsername()")
    return http.get(`/users/findByUsername/${username}`);
  }

  findByEmail(email) {
    console.log("inside UserDataService.js findByEmail()")
    return http.get(`/users/findByEmail/${email}`);
  }

  findByToken(access_token) {
    console.log("inside UserDataService.js findByToken()")
    return http.get(`/users/findByToken/${access_token}`);
  }

  resetPassword(data) {
    console.log("inside UserDataService.js resetPassword()")
    return http.post(`/users/resetPassword`, data);
  }

  update(id, data) {
    console.log("inside UserDataService.js update()")
    return http.post(`/users/update/${id}`, data);
  }

  changePassword(id, data) {
    console.log("inside UserDataService.js changePassword()")
    return http.post(`/users/changePassword/${id}`, data);
  }

  activateAccount(id) {
    console.log("inside UserDataService.js activateAccount()")
    return http.post(`/users/activateAccount/${id}`);
  }

  uploadImage(id, data) {
    console.log("inside UserDataService.js uploadImage()")
    return http.post(`/users/uploadImage/${id}`, data, { headers: { "Content-type": "multipart/form-data" } });
  }

  // RELATIONS

  findAllRelations(username) {
    console.log("inside UserDataService.js findAllRelations()")
    return http.get(`/relations/${username}`);
  }

  editRelation(data) {
    console.log("inside UserDataService.js editRelation()")
    return http.get(`/relations/edit`, data);
  }

  // AUTH

  login(data, withCredentials) {
    console.log("inside UserDataService.js login()")
    return http.post(`/auth/login`, data, withCredentials);
  }

  logout() {
    console.log("inside UserDataService.js logout()")
    return http.post(`/auth/logout`);
  }

  // delete(id) {
  //   return http.delete(`/users/${id}`);
  // }

  // deleteAll() {
  //   return http.delete(`/users`);
  // }

  // findByUsername(username) {
  //   return http.get(`/users?username=${username}`);
  // }

  // uploadImage(data) {
  //   return http.post('/uploadImage')
  // }
}

export default new UserDataService();