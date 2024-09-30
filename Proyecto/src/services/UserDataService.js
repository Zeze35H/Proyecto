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
    return http.post("/users", data);
  }

  findByUsername(username) {
    console.log("inside UserDataService.js findByUsername()")
    return http.get(`/users/${username}`);
  }

  findAllRelations(username) {
    console.log("inside UserDataService.js findAllRelations()")
    return http.get(`/relations/${username}`);
  }

  login(data, withCredentials) {
    console.log("inside UserDataService.js login()")
    return http.post(`/auth/login`, data, withCredentials);
  }

  logout() {
    console.log("inside UserDataService.js logout()")
    return http.post(`/auth/logout`);
  }

  // update(id, data) {
  //   return http.put(`/users/${id}`, data);
  // }

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