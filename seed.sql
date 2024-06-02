INSERT INTO users("id","fullName","phoneNumber","email","role", "createdAt", "updatedAt") VALUES( '6c84fb90-12c4-11e1-840d-7b25c5ee775a',  'Paul Morris','0703915556','kazimatch@gmail.com', 'recruiter', 'now()', 'now()');

INSERT INTO jobs(
	id, title, description, location, category, owner, type, start, "end", salary, skills, file, status, experience, "hasFeedback", close, "createdAt", "updatedAt")
	VALUES ('6c84fb90-12c4-11e1-840d-7b25c5ee775b', 'Carwash Attendant', 'excellent at detailing & buffing', 'Opposite 2 rivers', 'Carwash attendant', '6c84fb90-12c4-11e1-840d-7b25c5ee775a', 'Full time', '"2024-05-23 00:00:00+00"', '"2025-05-23 00:00:00+00"', '30% commission', '{buffing, detailing}', null, 'accepting', 'entry', 'false', '2024-06-22 11:17:30.603+00', 'now()', 'now()');