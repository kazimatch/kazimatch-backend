import { User } from "./user.model.js";
import { Notification } from "./notification.model.js";
import { Education } from "./education.model.js";
import { Experience } from "./experience.model.js";
import { Skill } from "./skill.model.js";
import { Language } from "./language.model.js";
import { Document } from "./document.model.js";

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

export {
    User,
    Notification,
    Education,
    Experience,
    Skill,
    Language,
    Document
}