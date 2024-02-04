import { User } from "./user.model.js";
import { Notification } from "./notification.model.js";
import { Education } from "./education.model.js";
import { Experience } from "./experience.model.js";
import { Skill } from "./skill.model.js";
import { Language } from "./language.model.js";
import { Document } from "./document.model.js";
import { Job } from "./job.model.js";
import { Application } from "./application.model.js";
import { Thread } from "./thread.model.js";
import { Message } from "./message.model.js";
import { Feedback } from "./feedback.model.js";
import { Plan } from "./plan.model.js";
import { Subscription } from "./subscription.model.js";

User.hasMany(Education, {
    foreignKey: "applicantId",
    as: "educations"
});

Education.belongsTo(User, {
    foreignKey: "applicantId",
});

User.hasMany(Skill, {
    foreignKey: "applicantId",
    as: "skills"
});

Skill.belongsTo(User, {
    foreignKey: "applicantId",
});

User.hasMany(Experience, {
    foreignKey: "applicantId",
    as: "experiences"
});

Experience.belongsTo(User, {
    foreignKey: "applicantId",
});

User.hasMany(Language, {
    foreignKey: "applicantId",
    as: "languages"
});

Language.belongsTo(User, {
    foreignKey: "applicantId",
});

User.hasMany(Document, {
    foreignKey: "owner",
    as: "documents"
});

Document.belongsTo(User, {
    foreignKey: "owner",
});

Job.hasOne(User, {
    sourceKey: "owner",
    foreignKey: "id",
    as: "employer"
});

User.hasMany(Job, {
    sourceKey: "id",
    foreignKey: "owner",
    as: "jobs"
});

Job.hasMany(Application, {
    foreignKey: "job",
    as: "applications"
});

Application.belongsTo(Job, {
    foreignKey: "job",
});

User.hasMany(Application, {
    foreignKey: "applicant",
    as: "applications"
});


Application.hasOne(User, {
    sourceKey: "applicant",
    foreignKey: "id",
    as: "user"
})

// User.hasMany(Thread, {
//     foreignKey: "partyA",
//     as: "sender"
// });

// User.hasMany(Thread, {
//     foreignKey: "partyB",
//     as: "recipient"
// });

Thread.hasOne(User, {
    sourceKey: "partyA",
    foreignKey: "id",
    as: "sender"
});

Thread.hasOne(User, {
    sourceKey: "partyB",
    foreignKey: "id",
    as: "receiver"
});

Thread.hasMany(Message, {
    foreignKey: "threadId",
    as: "messages"
});

export {
    User,
    Notification,
    Education,
    Experience,
    Skill,
    Language,
    Document,
    Job,
    Application,
    Message,
    Thread,
    Feedback,
    Plan,
    Subscription
}