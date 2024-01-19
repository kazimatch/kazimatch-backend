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

Document.belongsTo(User, {
    foreignKey: 'id',
    as: 'Owner'
});

Skill.belongsTo(User, {
    foreignKey: 'id',
    as: 'applicant'
})

User.hasMany(Skill, {
    foreignKey: 'applicantId',
    as: 'skills',
    onDelete: 'CASCADE'
})

User.hasMany(Experience, {
    foreignKey: 'applicantId',
    as: 'experiences',
    onDelete: 'CASCADE'
})

User.hasMany(Education, {
    foreignKey: 'applicantId',
    as: 'educations',
    onDelete: 'CASCADE'
})

User.hasMany(Language, {
    foreignKey: 'applicantId',
    as: 'languages',
    onDelete: 'CASCADE'
})

User.hasMany(Document, {
    foreignKey: 'owner',
    as: 'documents',
    onDelete: 'CASCADE'
})

User.hasMany(Notification, {
    foreignKey: 'recipient',
    as: 'notifications',
    onDelete: 'CASCADE'
})

User.hasMany(Job, {
    foreignKey: 'owner',
    as: 'jobs',
    onDelete: 'CASCADE'
});

User.hasMany(Application, {
    foreignKey: 'applicant',
    as: 'applications',
    onDelete: 'CASCADE'
})

Job.hasMany(Application, {
    foreignKey: "job",
    as: "applications",
    onDelete: 'CASCADE'
})

Job.hasOne(User, {
    foreignKey: "id",
    as: 'user'
})

Application.belongsTo(User, {
    foreignKey: "id",
    as: "user",
})

Application.belongsTo(Job, {
    foreignKey: "id",
    as: "source"
})

Thread.belongsTo(User, {
    foreignKey: 'partyA',
    as: 'userA'
})

Thread.belongsTo(User, {
    foreignKey: 'partyB',
    as: 'userB'
})

Message.belongsTo(User, {
    foreignKey: 'to',
    as: 'recipient'
})

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
    Thread
}