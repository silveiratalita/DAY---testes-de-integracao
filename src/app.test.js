const request = require("supertest");
const app = require("./app.js");
const { NotFoundError } = require("@prisma/client/runtime/library.js");

describe("POST/posts", () => {
  it("Testa a criação de um post e o retorno do post criado", async () => {
    const post = {
      title: "Titulo o post",
      content: "Conteudo do post",
    };
    await request(app)
      .post("/posts")
      .send(post)
      .expect((res) => {
        expect(res.status).toBe(201);
        expect(res.body.title).toStrictEqual(post.title);
        expect(res.body.content).toStrictEqual(post.content);
      });
  });
});

describe("PUT/posts", () => {
  it("Testa a altração de um post e o retorno do post altrado", async () => {
    const post = {
      title: "Titulo o post",
      content: "Conteudo do post",
    };
    const cratePost = await request(app)
      .post("/posts")
      .send(post)
      .expect((res) => {
        expect(res.status).toBe(201);
      });

    await request(app)
      .put(`/posts/${cratePost.body.id}`)
      .send({ title: "mudou", content: "mudou" })
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.title).toStrictEqual("mudou");
        expect(res.body.content).toStrictEqual("mudou");
        expect(res.body.id).toStrictEqual(cratePost.body.id);
      });
  });

  it("Testa o altercao de um post inexistente", async () => {
    await request(app)
      .put(`/posts/1000`)
      .send({ title: "mudou", content: "mudou" })
      .expect((res) => {
        expect(res.status).toBe(404);
        expect(res.body.msg).toStrictEqual("Post not found");
      });
  });

  it("Testa o altercao de um post com id invalido", async () => {
    await request(app)
      .put(`/posts/_teste`)
      .send({ title: "mudou", content: "mudou" })
      .expect((res) => {
        expect(res.status).toBe(400);
        expect(res.body.msg).toStrictEqual("Input Invalid");
      });
  });
});

describe("DELETE/posts", () => {
  it("Testa o delet de um id inexstente", async () => {
    await request(app)
      .delete("/posts/2000")
      .expect((res) => {
        expect(res.status).toBe(404);
        expect(res.body.msg).toStrictEqual("Post not found");
      });
  });
  it("Testa o delete com id invalido", async () => {
    await request(app)
      .delete("/posts/_teste")
      .expect((res) => {
        expect(res.status).toBe(400);
        expect(res.body.msg).toStrictEqual("Input Invalid");
      });
  });

  it("Testa o delete com id valido e sucesso", async () => {
    const post = {
      title: "Titulo o post",
      content: "Conteudo do post",
    };
    const createPost = await request(app)
      .post("/posts")
      .send(post)
      .expect((res) => {
        expect(res.status).toBe(201);
      });

    await request(app)
      .delete(`/posts/${createPost.body.id}`)
      .expect((res) => {
        expect(res.status).toBe(204);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe("GET/posts", () => {
  it("Testa a busca de um post po Id com sucesso", async () => {
    const post = {
      title: "Titulo o post",
      content: "Conteudo do post",
    };
    const createPost = await request(app)
      .post("/posts")
      .send(post)
      .expect((res) => {
        expect(res.status).toBe(201);
      });

    await request(app)
      .get(`/posts/${createPost.body.id}`)
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(createPost.body);
      });
  });
  it("Testa busca de ID invalido", async () => {
    await request(app)
      .get(`/posts/_test`)
      .expect((res) => {
        expect(res.status).toBe(400);
        expect(res.body.msg).toStrictEqual("Input Invalid");
      });
  });

  it("Testa busca de um ID que nao existe", async () => {
    await request(app)
      .get(`/posts/2000`)
      .expect((res) => {
        expect(res.status).toBe(404);
        expect(res.body.msg).toStrictEqual("Post not found");
      });
  });

  it("Testa busca de todos os posts", async () => {
    const posts = [];
    for (let i = 0; i <= 4; i++) {
      const post = {
        title: "Titulo o post",
        content: "Conteudo do post",
      };
      const postCreated = await request(app)
        .post("/posts")
        .send(post)
        .expect((res) => {
          expect(res.status).toBe(201);
        });
      posts.push(postCreated.body);
    }

    response = await request(app).get(`/posts`);
    response.body.forEach((post) => {
      expect(post).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
      });
    });
  });
});
