import express from "express";
import pool from "../config/db.js";

const router = express.Router();
const q = "Select * from story";

router.get("/", (req, res) => {
    pool.query(q)
        .then(([response]) => {
            res.render('home', { datas: response });
        })
        .catch((err) => {
            console.error(err);
            res.json({ message: "Error", error: err });
        })
})
router.get("/story/:id", (req, res) => {
    const q = "SELECT * FROM story JOIN category on story.category_id = category.id WHERE story.id = ? ";
    pool.execute(q, [req.params.id])
        .then(([[datas]]) => {
            res.render('story', { datas })
        })
})

router.get('/admin', (req, res) => {
    res.render('admin/index');
})

router.get("/admin/story", (req, res) => {
    const q = "SELECT * FROM story";
    pool.query(q).then(([stories]) => {
        res.render("admin/story/list", { stories });
    });
});

router.get("/admin/story/create", (req, res) => {
    const q = "SELECT * FROM category";
    pool.query(q).then(([categories]) => {
        res.render("admin/story/create", { categories });
    });
});

router.post("/admin/story/create", (req, res) => {
    console.log(req.body);
    const q =
        "INSERT INTO story (title, content, publishDate, img, category_id) VALUES (?, ?, NOW(), ?, ?)";
    pool.execute(q, [
        req.body.title,
        req.body.content,
        req.body.img,
        req.body.category_id,
    ])
        .then(() => {
            res.redirect("/admin/story");
        })
        .catch((error) => console.log(error));
});
let id = "";
router.get("/admin/story/:id", (req, res) => {
    const q = "SELECT * FROM story WHERE story.id = ? ";
    id = req.params.id;
    pool.execute(q, [req.params.id])
        .then(([[datas]]) => {
            res.render('admin/story/update', { datas })
        })
});
router.post("/admin/story/update", (req, res) => {
    console.log(id);
    console.log(req.body);
    const q =
        "Update story SET title = ?, content = ?,img=? where id = ?";
    pool.execute(q, [
        req.body.title,
        req.body.content,
        req.body.img,
        id,
    ])
        .then(() => {
            res.redirect("/admin/story");
        })
        .catch((error) => console.log(error));
});

router.get("/admin/story/delete/:id", (req, res) => {
    const q = "DELETE FROM story WHERE story.id = ? ";
    pool.execute(q, [req.params.id])
        .then(() => {
            res.redirect("/admin/story");
        })
        .catch((error) => console.log(error));
});

export default router;