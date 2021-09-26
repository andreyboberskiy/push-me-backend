const { Router } = require("express");

const router = Router();

const TemplateService = require("/services/template");

const checkTemplateWithId1 = (req, res, next) => {
  try {
    const data = TemplateService.checkUpdates(1);

    return res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

router.post("/check-template-updates", checkTemplateWithId1);
module.exports = router;
