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
    console.log(data)
    return http.post("/users", data);
  }

  findByUsername(username) {
    console.log("inside UserDataService.js findByUsername()")
    console.log(username)
    return http.get(`/users/${username}`);
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