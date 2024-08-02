const request = require("supertest");
const app = require("./app");

describe("POST/posts", () => {
  let currentPostId = 0;

  it("Testa a criacao de um post e o restorno do post criado", async () => {
    await request(app)
      .get("/posts")
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual([]);
      });
    const post = {
      title: "Aula de Testes de integracao",
      content:
        "Aula de teste de integracao feita em Node js, utilizando a biblioteca supertest e o jest.",
    };

    const postSalvo = { id: 1, title: post.title, content: post.content };
    await request(app)
      .post("/posts")
      .send(post)
      .expect((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual(postSalvo);
      });
    currentPostId++;

    await request(app)
      .get("/posts")
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual([postSalvo]);
      });
  });
});
describe("PUT/posts", () => {
  let currentPostId = 0;
  it("Altera o post com id valido", async () => {
    let createdPostId;

    const post = {
      title: "Aula de Testes de integracao - teste2",
      content:
        "Aula de teste de integracao feita em Node js, utilizando a biblioteca supertest e o jest.",
    };

    const createResponse = await request(app).post("/posts").send(post);
    expect(createResponse.status).toBe(201);
    createdPostId = createResponse.body.id;

    console.log("talitaaaaaa", createResponse.body);
    await request(app)
      .put(`/posts/${createdPostId}`)
      .send({ title: "mudar", content: "mudar" })
      .expect((res) => {
        expect(res.body.title).toStrictEqual("mudar");
        expect(res.body.content).toStrictEqual("mudar");
      });
  });
  it("Altera o post com id invalido", async () => {
    await request(app)
      .put(`/posts/teste`)
      .send({ title: "mudar", content: "mudar" })
      .expect((res) => {
        expect(res.body.msg).toStrictEqual("Input Invalid");
        expect(res.status).toBe(400);
      });
  });
  it("Altera o post com id nao existente", async () => {
    await request(app)
      .put(`/posts/1000`)
      .send({ title: "mudar", content: "mudar" })
      .expect((res) => {
        expect(res.body.msg).toStrictEqual("Post not found");
        expect(res.status).toBe(404);
      });
  });
});
describe("DELETE/posts", () => {
  it("Deletar o post com id valido", async () => {
    let createdPostId;
    const post = {
      title: "Aula de Testes de integracao - Teste de exclusao ",
      content:
        "Aula de teste de integracao feita em Node js, utilizando a biblioteca supertest e o jest.",
    };

    const createResponse = await request(app).post("/posts").send(post);
    expect(createResponse.status).toBe(201);
    createdPostId = createResponse.body.id;

    await request(app)
      .get(`/posts/${createdPostId}`)
      .expect((res) => {
        expect(res.body.id).toStrictEqual(createdPostId);
      });

    await request(app)
      .delete(`/posts/${createdPostId}`)
      .expect((res) => {
        expect(res.status).toBe(204);
        expect(res.body).toStrictEqual({});
      });
  });
  it("Deleta o post com id invalido", async () => {
    await request(app)
      .delete(`/posts/_teste`)
      .expect((res) => {
        expect(res.body.msg).toStrictEqual("Input Invalid");
        expect(res.status).toBe(400);
      });
  });
  it("Deleta o post com id nao existente", async () => {
    await request(app)
      .delete(`/posts/1000`)
      .expect((res) => {
        expect(res.body.msg).toStrictEqual("Post not found");
        expect(res.status).toBe(404);
      });
  });
});
describe("GET/posts", () => {
  it("Retorna todos os posts registrados", async () => {
    let posts = [];
    for (let i = 0; i <= 10; i++) {
      const post = {
        title: "Aula de Testes de integracao - Teste de exclusao ",
        content:
          "Aula de teste de integracao feita em Node js, utilizando a biblioteca supertest e o jest.",
      };

      const createResponse = await request(app).post("/posts").send(post);
      expect(createResponse.status).toBe(201);
      posts.push(createResponse.body);
    }
    const response = await request(app).get("/posts");
    response.body.forEach((post) => {
      expect(post).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
      });
    });
  });

  it("Retorna um post com id invalido", async () => {
    await request(app)
      .get(`/posts/hhh`)
      .expect((res) => {
        expect(res.status).toBe(400);
        expect(res.body.msg).toStrictEqual("Input Invalid");
      });
  });

  it("Retorna um post com id validos", async () => {
    const post = {
      title: "Aula de Testes de integracao - Teste de exclusao ",
      content:
        "Aula de teste de integracao feita em Node js, utilizando a biblioteca supertest e o jest.",
    };
    const createResponse = await request(app).post("/posts").send(post);
    expect(createResponse.status).toBe(201);
    const postId = createResponse.body.id;

    await request(app)
      .get(`/posts/${postId}`)
      .expect((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id).toStrictEqual(createResponse.body.id);
        expect(res.body.title).toStrictEqual(createResponse.body.title);
        expect(res.body.content).toStrictEqual(createResponse.body.content);
      });
  });

  it("Retorna um post com id inexistente", async () => {
    await request(app)
      .get(`/posts/10000`)
      .expect((res) => {
        expect(res.status).toBe(404);
        expect(res.body.msg).toStrictEqual("Post not found");
      });
  });
});
