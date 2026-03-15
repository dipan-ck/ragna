import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import * as conversationController from "./conversation.controller.js";

const router = Router();
router.get(
    "/project/:projectId",
    requireAuth,
    conversationController.getProjectConversations,
);
router.post(
    "/project/:projectId",
    requireAuth,
    conversationController.createConversation,
);
router.delete(
    "/:conversationId",
    requireAuth,
    conversationController.deleteConversation,
);
router.patch(
    "/:conversationId/title",
    requireAuth,
    conversationController.updateConversationTitle,
);
router.get(
    "/:conversationId/messages",
    requireAuth,
    conversationController.getMessages,
);
router.post(
    "/:conversationId/messages",
    requireAuth,
    conversationController.sendMessage,
);
export default router;
