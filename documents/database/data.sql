--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.schema_migrations (version) VALUES ('20171026211738');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211808');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211834');
INSERT INTO auth.schema_migrations (version) VALUES ('20180103212743');
INSERT INTO auth.schema_migrations (version) VALUES ('20180108183307');
INSERT INTO auth.schema_migrations (version) VALUES ('20180119214651');
INSERT INTO auth.schema_migrations (version) VALUES ('20180125194653');
INSERT INTO auth.schema_migrations (version) VALUES ('00');
INSERT INTO auth.schema_migrations (version) VALUES ('20210710035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210722035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210730183235');
INSERT INTO auth.schema_migrations (version) VALUES ('20210909172000');
INSERT INTO auth.schema_migrations (version) VALUES ('20210927181326');
INSERT INTO auth.schema_migrations (version) VALUES ('20211122151130');
INSERT INTO auth.schema_migrations (version) VALUES ('20211124214934');
INSERT INTO auth.schema_migrations (version) VALUES ('20211202183645');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185221');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185340');
INSERT INTO auth.schema_migrations (version) VALUES ('20220224000811');
INSERT INTO auth.schema_migrations (version) VALUES ('20220323170000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220429102000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220531120530');
INSERT INTO auth.schema_migrations (version) VALUES ('20220614074223');
INSERT INTO auth.schema_migrations (version) VALUES ('20220811173540');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041349');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221011041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221020193600');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021073300');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021082433');
INSERT INTO auth.schema_migrations (version) VALUES ('20221027105023');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143410');
INSERT INTO auth.schema_migrations (version) VALUES ('20221125140132');
INSERT INTO auth.schema_migrations (version) VALUES ('20221208132122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195500');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195800');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195900');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124310');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124412');
INSERT INTO auth.schema_migrations (version) VALUES ('20230131181311');
INSERT INTO auth.schema_migrations (version) VALUES ('20230322519590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230402418590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230411005111');
INSERT INTO auth.schema_migrations (version) VALUES ('20230508135423');
INSERT INTO auth.schema_migrations (version) VALUES ('20230523124323');
INSERT INTO auth.schema_migrations (version) VALUES ('20230818113222');
INSERT INTO auth.schema_migrations (version) VALUES ('20230914180801');
INSERT INTO auth.schema_migrations (version) VALUES ('20231027141322');
INSERT INTO auth.schema_migrations (version) VALUES ('20231114161723');
INSERT INTO auth.schema_migrations (version) VALUES ('20231117164230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240115144230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240214120130');
INSERT INTO auth.schema_migrations (version) VALUES ('20240306115329');
INSERT INTO auth.schema_migrations (version) VALUES ('20240314092811');
INSERT INTO auth.schema_migrations (version) VALUES ('20240427152123');
INSERT INTO auth.schema_migrations (version) VALUES ('20240612123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240729123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240802193726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240806073726');
INSERT INTO auth.schema_migrations (version) VALUES ('20241009103726');


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: -
--



--
-- Data for Name: class_registration_period; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: faculties; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.faculties (id, created_at, faculty_code, name, updated_at) VALUES ('eb4fb569-5620-45d7-aae3-d8d0e4f45ea0', '2025-06-14 16:17:51.347384+00', 'IT', 'Công nghệ thông tin', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.faculties (id, created_at, faculty_code, name, updated_at) VALUES ('21d63241-97c6-4e4b-810a-e6d2d1e41e4e', '2025-06-14 16:17:51.347384+00', 'PHYS', 'Vật lý - Vật lý kĩ thuật', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.faculties (id, created_at, faculty_code, name, updated_at) VALUES ('a7c38abc-a114-404a-82a3-36a120887048', '2025-06-14 16:17:51.347384+00', 'GEO', 'Địa chất', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.faculties (id, created_at, faculty_code, name, updated_at) VALUES ('8cad58e3-06e2-4b4f-8b04-59d419b82f47', '2025-06-14 16:17:51.347384+00', 'MATH', 'Toán tin học', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.faculties (id, created_at, faculty_code, name, updated_at) VALUES ('f6401f36-25ad-4660-b358-b6845b423e24', '2025-06-14 16:17:51.347384+00', 'ECE', 'Điện tử viễn thông', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.faculties (id, created_at, faculty_code, name, updated_at) VALUES ('04cc5590-3900-4d14-9f38-dbc81d4c6e3f', '2025-06-14 16:17:51.347384+00', 'MATE', 'Khoa học & Công nghệ vật liệu', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.faculties (id, created_at, faculty_code, name, updated_at) VALUES ('d242295a-f286-4c55-8afb-6f4b234e3dea', '2025-06-14 16:17:51.347384+00', 'CHEM', 'Hóa học', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.faculties (id, created_at, faculty_code, name, updated_at) VALUES ('eecf73c0-46f4-4d25-b482-e52cfc56af9b', '2025-06-14 16:17:51.347384+00', 'BIO', 'Sinh học - Công nghệ sinh học', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.faculties (id, created_at, faculty_code, name, updated_at) VALUES ('24bede0a-3e90-4c16-87d0-f9f9d67f8d5e', '2025-06-14 16:17:51.347384+00', 'ENV', 'Môi trường', '2025-06-14 16:17:51.347384+00');


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00101', '2025-06-14 16:38:23.908109+00', '2025-06-15 16:56:45.184+00', 'Triết học Mác - Lênin', 3, 'MATH', 'Những nguyên lý triết học Mác - Lênin', NULL, true, '08bdf58d-6999-452c-860c-835dfde076d0');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00003', '2025-06-14 16:38:23.908109+00', '2025-06-15 16:56:55.698+00', 'Tư tưởng Hồ Chí Minh', 2, 'MATH', 'Môn học về tư tưởng Hồ Chí Minh', NULL, true, '7b3b6f91-2c2e-462d-9470-edcddb005f95');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00004', '2025-06-14 16:38:23.908109+00', '2025-06-15 16:56:58.274+00', 'Pháp luật đại cương', 2, 'MATH', 'Những kiến thức pháp luật cơ bản', NULL, true, '36d3263d-8958-43d3-a36f-e7fae55b5e35');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00011', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Anh văn 1', 3, 'MATH', 'Anh văn trình độ cơ bản', NULL, true, 'b2f7bf8b-1a53-4839-beb8-b8463579fc45');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00012', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Anh văn 2', 3, 'MATH', 'Anh văn trình độ sơ trung cấp', '{BAA00011}', true, 'a786fbfd-6ae2-495a-8b2f-b7e522898b43');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00013', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Anh văn 3', 3, 'MATH', 'Anh văn trình độ trung cấp', '{BAA00012}', true, 'b5b6eb8a-f47c-4ec8-ade7-aa437502ec02');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00014', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Anh văn 4', 3, 'MATH', 'Anh văn trình độ nâng cao', '{BAA00013}', true, '3fc1185e-13bd-42e7-af21-6513fc2ca921');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00021', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Thể dục 1', 1, 'MATH', 'Giáo dục thể chất cơ bản', NULL, true, '4dfbe434-d788-48fa-b04e-9df945374002');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00022', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Thể dục 2', 1, 'MATH', 'Giáo dục thể chất nâng cao', '{BAA00021}', true, '33acc5e0-95ce-495d-80a7-aa5ce4b4c694');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00102', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Kinh tế chính trị Mác - Lênin', 2, 'MATH', 'Kinh tế học theo quan điểm Mác - Lênin', '{BAA00101}', true, 'eefc81f7-9a89-4d73-a8f7-adf694eb44d3');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00103', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Chủ nghĩa xã hội khoa học', 2, 'MATH', 'Nghiên cứu về chủ nghĩa xã hội theo Mác - Lênin', '{BAA00101}', true, '9cf66b68-cac5-4611-9d11-c64fcdcb83a9');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('BAA00104', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Lịch sử Đảng Cộng sản Việt Nam', 2, 'MATH', 'Lịch sử hình thành và phát triển của Đảng', NULL, true, '6116df06-d485-4af4-80bb-50939545bb36');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('CSC00004', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Nhập môn công nghệ thông tin', 3, 'IT', 'Giới thiệu cơ bản về CNTT', NULL, true, 'a890a751-8acb-4eeb-b37d-cab25f3f3ea1');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('MTH00021', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Vi tích phân 1', 3, 'MATH', 'Giải tích một biến', NULL, true, '88208789-e0ce-4b49-a8f4-8a55cdb97ea2');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('MTH00022', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Vi tích phân 2', 3, 'MATH', 'Giải tích nhiều biến', '{MTH00021}', true, '36d716ec-3d01-460c-b1d8-f1d7506ab89c');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('MTH00035', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Đại số tuyến tính', 3, 'MATH', 'Ma trận, vector và không gian tuyến tính', NULL, true, '30ab3741-63d5-4016-8dfe-7664f66bdda2');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('MTH00044', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Xác suất thống kê', 3, 'MATH', 'Cơ bản về xác suất và thống kê', NULL, true, 'f1f95c39-f1e6-4886-916e-5aeef1db5fd4');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('MTH00045', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Toán rời rạc', 3, 'MATH', 'Logic, tập hợp, đồ thị, tổ hợp', NULL, true, '5776a9b0-f339-44f4-84a0-ff07c4b553db');
INSERT INTO public.courses (course_code, created_at, updated_at, name, credits, faculty_code, description, prerequisite_course_code, is_active, id) VALUES ('MTH00050', '2025-06-14 16:38:23.908109+00', '2025-06-14 16:38:23.908109+00', 'Toán học tổ hợp', 3, 'MATH', 'Phép đếm, hoán vị, chỉnh hợp, tổ hợp nâng cao', '{MTH00045}', true, '8e932179-2a50-49ab-9089-b6975ca7e7a9');


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('804acba5-7c63-4c66-ab79-6c544f2393ef', '2025-06-14 16:42:40.808866+00', 'MT21120', 'MTH00021', 'Kỳ 1', 2020, 'TS. Nguyễn Văn Toán', 50, 'A1.201', 'T2-4, 7:30-9:00', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('342286de-b987-464b-97b7-d44f7c8556c3', '2025-06-14 16:42:40.808866+00', 'MT35120', 'MTH00035', 'Kỳ 1', 2020, 'PGS. Trần Thị Đại Số', 45, 'A1.202', 'T3-5, 9:00-10:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('35a60bf8-3ab5-45aa-8a2e-abfe64cc2abc', '2025-06-14 16:42:40.808866+00', 'CS04120', 'CSC00004', 'Kỳ 1', 2020, 'TS. Lê Công Nghệ', 60, 'B2.101', 'T4-6, 13:00-14:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('32af0b39-9234-4b85-8c83-e0c97052530a', '2025-06-14 16:42:40.808866+00', 'BA03120', 'BAA00003', 'Kỳ 1', 2020, 'TS. Hoàng Tư Tưởng', 70, 'C3.301', 'T2-4, 15:00-16:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('68da3223-f6b4-45c8-8f93-72580238923c', '2025-06-14 16:42:40.808866+00', 'MT22220', 'MTH00022', 'Kỳ 2', 2020, 'TS. Nguyễn Văn Toán', 50, 'A1.203', 'T3-5, 7:30-9:00', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('ecadab56-f3f4-4872-8e1f-ba304fb51afc', '2025-06-14 16:42:40.808866+00', 'MT45220', 'MTH00045', 'Kỳ 2', 2020, 'TS. Phạm Rời Rạc', 40, 'A1.204', 'T2-4, 9:00-10:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('0122f0fe-3a4c-4e19-9bda-4031228a2018', '2025-06-14 16:42:40.808866+00', 'BA04220', 'BAA00004', 'Kỳ 2', 2020, 'TS. Trần Pháp Luật', 65, 'C3.302', 'T4-6, 13:00-14:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('1bd851ca-652e-4084-a183-403044fd287f', '2025-06-14 16:42:40.808866+00', 'BA11220', 'BAA00011', 'Kỳ 2', 2020, 'GV. Nguyễn Anh Văn', 55, 'D4.101', 'T3-5, 15:00-16:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('18ee2714-9325-4040-afc8-c76bd50cb3b6', '2025-06-14 16:42:40.808866+00', 'MT44320', 'MTH00044', 'Kỳ 3', 2020, 'PGS. Lê Xác Suất', 45, 'A1.205', 'T2-4, 7:30-9:00', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('361176c9-eed6-4a53-ba90-8aa5dfaa86c7', '2025-06-14 16:42:40.808866+00', 'BA12220', 'BAA00012', 'Kỳ 3', 2020, 'GV. Nguyễn Anh Văn', 50, 'D4.102', 'T3-5, 9:00-10:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('1bfb1664-cc2a-416d-b47a-1fdb9934298d', '2025-06-14 16:42:40.808866+00', 'BA21220', 'BAA00021', 'Kỳ 3', 2020, 'GV. Vũ Thể Dục', 80, 'Sân vận động', 'T6, 7:00-9:00', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('5c878d2a-4b18-4ca7-821b-ad3f0de49c1b', '2025-06-14 16:42:40.808866+00', 'MT21121', 'MTH00021', 'Kỳ 1', 2021, 'TS. Nguyễn Văn Toán', 50, 'A1.201', 'T2-4, 7:30-9:00', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('feb826d8-9715-47f2-b8ee-bb79208ff61e', '2025-06-14 16:42:40.808866+00', 'MT35121', 'MTH00035', 'Kỳ 1', 2021, 'PGS. Trần Thị Đại Số', 45, 'A1.202', 'T3-5, 9:00-10:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('0f1ef033-fca9-4817-886e-40f05f07fd8c', '2025-06-14 16:42:40.808866+00', 'BA13121', 'BAA00013', 'Kỳ 1', 2021, 'GV. Nguyễn Anh Văn', 50, 'D4.103', 'T4-6, 13:00-14:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('2e76adb8-44af-44f1-a00a-4fcccc048708', '2025-06-14 16:42:40.808866+00', 'BA10221', 'BAA00102', 'Kỳ 1', 2021, 'TS. Lê Kinh Tế', 60, 'C3.303', 'T2-4, 15:00-16:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('4aa3cdc8-b55a-49cb-9161-1b2a573def36', '2025-06-14 16:42:40.808866+00', 'MT22221', 'MTH00022', 'Kỳ 2', 2021, 'TS. Nguyễn Văn Toán', 50, 'A1.203', 'T3-5, 7:30-9:00', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('8facfd50-192d-430f-8d5e-bbeb74392817', '2025-06-14 16:42:40.808866+00', 'MT50221', 'MTH00050', 'Kỳ 2', 2021, 'TS. Phạm Rời Rạc', 40, 'A1.206', 'T2-4, 9:00-10:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('827345b8-d8b6-4ead-a373-ab57404cf068', '2025-06-14 16:42:40.808866+00', 'BA14221', 'BAA00014', 'Kỳ 2', 2021, 'GV. Nguyễn Anh Văn', 45, 'D4.104', 'T4-6, 13:00-14:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('20239226-1f2e-425d-9843-044072c1bfb1', '2025-06-14 16:42:40.808866+00', 'BA10321', 'BAA00103', 'Kỳ 2', 2021, 'TS. Hoàng Xã Hội', 55, 'C3.304', 'T3-5, 15:00-16:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('9af10099-6f8e-4c08-9bf7-fb3cdec005b9', '2025-06-14 16:42:40.808866+00', 'MT44321', 'MTH00044', 'Kỳ 3', 2021, 'PGS. Lê Xác Suất', 45, 'A1.205', 'T2-4, 7:30-9:00', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('3f90de04-29dd-4f06-a065-7c2a85024993', '2025-06-14 16:42:40.808866+00', 'BA22221', 'BAA00022', 'Kỳ 3', 2021, 'GV. Vũ Thể Dục', 80, 'Sân vận động', 'T6, 7:00-9:00', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('381cc254-c852-47a3-8c69-08e2a07f10d1', '2025-06-14 16:42:40.808866+00', 'BA10421', 'BAA00104', 'Kỳ 3', 2021, 'TS. Trần Lịch Sử', 60, 'C3.305', 'T3-5, 9:00-10:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('eb0ce719-083f-40c1-a850-bb3776991e1b', '2025-06-14 16:42:40.808866+00', 'MT21122', 'MTH00021', 'Kỳ 1', 2022, 'TS. Nguyễn Văn Toán', 50, 'A1.201', 'T2-4, 7:30-9:00', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('e28dd9b9-efb1-4cf7-bf85-f91fa730280a', '2025-06-14 16:42:40.808866+00', 'MT35122', 'MTH00035', 'Kỳ 1', 2022, 'PGS. Trần Thị Đại Số', 45, 'A1.202', 'T3-5, 9:00-10:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('52b37c4f-73c3-4a85-848a-94d63019f3ed', '2025-06-14 16:42:40.808866+00', 'CS04122', 'CSC00004', 'Kỳ 1', 2022, 'TS. Lê Công Nghệ', 60, 'B2.101', 'T4-6, 13:00-14:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('b4c4c1fe-8757-4047-ac94-b5d598a233af', '2025-06-14 16:42:40.808866+00', 'BA03122', 'BAA00003', 'Kỳ 1', 2022, 'TS. Hoàng Tư Tưởng', 70, 'C3.301', 'T2-4, 15:00-16:30', '2025-06-14 16:42:40.808866+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('020fc9aa-8bfa-4644-8fda-d01e6159cad6', '2025-06-14 18:44:37.798744+00', 'MT21120B', 'MTH00021', 'Kỳ 1', 2020, 'PGS. Lê Giải Tích', 50, 'A1.207', 'T3-5, 7:30-9:00', '2025-06-14 18:44:37.798744+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('a2a249da-6357-4e9a-93dd-4794c0151997', '2025-06-14 18:44:37.798744+00', 'MT35121B', 'MTH00035', 'Kỳ 1', 2021, 'TS. Vũ Đại Số', 45, 'A1.208', 'T4-6, 9:00-10:30', '2025-06-14 18:44:37.798744+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('fd1d855a-e6ba-4990-a1ec-b00e788565ca', '2025-06-14 18:44:37.798744+00', 'CS04122B', 'CSC00004', 'Kỳ 1', 2022, 'TS. Phạm Công Nghệ', 60, 'B2.102', 'T5-7, 13:00-14:30', '2025-06-14 18:44:37.798744+00');
INSERT INTO public.classes (id, created_at, class_code, course_code, semester, academic_year, instructor, max_students, room, schedule, updated_at) VALUES ('97f47b60-86c0-4480-8d82-db31747a7246', '2025-06-14 18:44:37.798744+00', 'MT21121R', 'MTH00021', 'Kỳ 3', 2021, 'TS. Nguyễn Văn Toán', 30, 'A1.209', 'T2-4, 17:00-18:30', '2025-06-14 18:44:37.798744+00');


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.programs (id, created_at, program_code, name, updated_at) VALUES ('57b32603-0223-48fd-9ce3-1acc32595862', '2025-06-14 16:17:51.347384+00', 'CQ', 'Chính quy', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.programs (id, created_at, program_code, name, updated_at) VALUES ('a5532c14-419e-46b2-b317-1a3832f6629c', '2025-06-14 16:17:51.347384+00', 'TT', 'Tiên tiến', '2025-06-14 16:17:51.347384+00');
INSERT INTO public.programs (id, created_at, program_code, name, updated_at) VALUES ('26c90c1a-90e9-4d88-8f9d-e301a5eef013', '2025-06-14 16:17:51.347384+00', 'CLC', 'Chất lượng cao', '2025-06-14 16:17:51.347384+00');


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('09f28f65-1b69-45f4-947b-516913d9573c', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Nguyễn Văn A', '2002-05-14', 'vana@student.university.edu.vn', '0987654321', 'Vietnam', '{"nation": "Vietnam", "street": "123 Lê Lợi", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', '{"nation": "Vietnam", "street": "456 Trần Hưng Đạo", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Hoàn Kiếm"}', '{"nation": "Vietnam", "street": "789 Phạm Ngũ Lão", "district": "Cầu Giấy", "city_province": "Hà Nội", "wards_communes": "Cầu Giấy"}', 'IT', '2021', 'Đang học', '2021001', 'CQ', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('86149f41-b866-4ea2-89d8-eae6a546dda7', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Trần Thị Bình', '2001-08-23', 'binhtt@student.university.edu.vn', '0912345678', 'Vietnam', '{"nation": "Vietnam", "street": "45 Nguyễn Du", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Nghé"}', '{"nation": "Vietnam", "street": "78 Lê Duẩn", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Thành"}', '{"nation": "Vietnam", "street": "12 Nguyễn Thị Minh Khai", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', 'IT', '2020', 'Tốt nghiệp', '2020002', 'CLC', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('df87b214-ddab-4c5e-ad2a-cb2fab1d6e13', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Lê Hoàng Cường', '2003-02-15', 'cuonglh@student.university.edu.vn', '0978123456', 'Vietnam', '{"nation": "Vietnam", "street": "32 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "54 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', '{"nation": "Vietnam", "street": "87 Hùng Vương", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'IT', '2022', 'Đang học', '2022003', 'TT', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('dfa75fa2-3d51-49a1-9480-3b083a32d914', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Phạm Thị Dung', '2002-11-30', 'dungpt@student.university.edu.vn', '0965432187', 'Vietnam', '{"nation": "Vietnam", "street": "21 Lý Thường Kiệt", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Hoàn Kiếm"}', '{"nation": "Vietnam", "street": "43 Tràng Thi", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Hoàn Kiếm"}', '{"nation": "Vietnam", "street": "65 Hàng Bài", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Hoàn Kiếm"}', 'IT', '2021', 'Bảo lưu', '2021004', 'CQ', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('6284365a-84b7-4980-b756-1321a0437c25', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Hoàng Văn Đạt', '2000-07-12', 'dathv@student.university.edu.vn', '0988776655', 'Vietnam', '{"nation": "Vietnam", "street": "89 Nguyễn Chí Thanh", "district": "Đống Đa", "city_province": "Hà Nội", "wards_communes": "Đống Đa"}', '{"nation": "Vietnam", "street": "34 Kim Mã", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', '{"nation": "Vietnam", "street": "56 Giảng Võ", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', 'IT', '2019', 'Tốt nghiệp', '2019005', 'CLC', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('13851d17-c1de-4521-8202-a178f7032331', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Vũ Minh Anh', '2002-03-08', 'anhvu@student.university.edu.vn', '0988123456', 'Vietnam', '{"nation": "Vietnam", "street": "34 Trần Hưng Đạo", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Cửa Nam"}', '{"nation": "Vietnam", "street": "56 Lý Thường Kiệt", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Trần Hưng Đạo"}', '{"nation": "Vietnam", "street": "78 Hàng Bài", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Hàng Bài"}', 'GEO', '2021', 'Đang học', '2021011', 'CLC', 'Khác');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('e97282f2-c440-4108-a3f5-7d7224f499db', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Đặng Quốc Bảo', '2001-07-19', 'baodang@student.university.edu.vn', '0977123456', 'Vietnam', '{"nation": "Vietnam", "street": "12 Nguyễn Huệ", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Nghé"}', '{"nation": "Vietnam", "street": "34 Đồng Khởi", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Nghé"}', '{"nation": "Vietnam", "street": "56 Lê Lợi", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Thành"}', 'GEO', '2020', 'Tốt nghiệp', '2020012', 'CQ', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('a04c5f5f-dd6e-4df2-a433-508e669ebadd', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Bùi Thị Chi', '2003-02-14', 'chibui@student.university.edu.vn', '0966123456', 'Vietnam', '{"nation": "Vietnam", "street": "78 Nguyễn Văn Cừ", "district": "Long Biên", "city_province": "Hà Nội", "wards_communes": "Ngọc Lâm"}', '{"nation": "Vietnam", "street": "90 Ngô Gia Tự", "district": "Long Biên", "city_province": "Hà Nội", "wards_communes": "Đức Giang"}', '{"nation": "Vietnam", "street": "12 Nguyễn Văn Linh", "district": "Long Biên", "city_province": "Hà Nội", "wards_communes": "Sài Đồng"}', 'GEO', '2022', 'Đang học', '2022013', 'TT', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('93223575-26b5-4c88-81e6-7d106b895a88', '2025-06-14 16:33:42.195055+00', '2025-06-15 15:51:00.306+00', 'Nguyễn Thị Mai', '2001-09-18', 'mainguyen@student.university.edu.vn', '+847728213', 'Vietnam', '{"nation": "Vietnam", "street": "12 Điện Biên Phủ", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Thanh Bình"}', '{"nation": "Vietnam", "street": "34 Ngô Quyền", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Thạch Thang"}', '{"nation": "Vietnam", "street": "56 Lê Lợi", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'PHYS', '2020', 'Đang học', '2020006', 'TT', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('4d683589-6246-4653-9114-2968a03fb3eb', '2025-06-14 16:33:42.195055+00', '2025-06-15 15:51:00.365+00', 'Hoàng Thị Ngọc', '2001-06-22', 'ngochoang@student.university.edu.vn', '+847728213', 'Vietnam', '{"nation": "Vietnam", "street": "56 Lê Hồng Phong", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Thạch Thang"}', '{"nation": "Vietnam", "street": "78 Trần Cao Vân", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', '{"nation": "Vietnam", "street": "90 Ông Ích Khiêm", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'PHYS', '2020', 'Đình chỉ', '2020010', 'TT', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('0df0c381-dfab-43bf-a4b4-91e9eb5d7397', '2025-06-14 16:33:42.195055+00', '2025-06-15 15:51:00.507+00', 'Trần Văn Hải', '2002-04-25', 'haitran@student.university.edu.vn', '+847728213', 'Vietnam', '{"nation": "Vietnam", "street": "78 Trần Hưng Đạo", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Phạm Ngũ Lão"}', '{"nation": "Vietnam", "street": "90 Nguyễn Thái Học", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Cầu Ông Lãnh"}', '{"nation": "Vietnam", "street": "12 Bùi Viện", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Phạm Ngũ Lão"}', 'PHYS', '2021', 'Đang học', '2021007', 'CQ', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('9b33f057-c5de-4b0a-bd18-1dc018149ec1', '2025-06-14 16:33:42.195055+00', '2025-06-15 15:51:00.551+00', 'Lê Thị Kim', '2003-01-03', 'kimle@student.university.edu.vn', '+847728213', 'Vietnam', '{"nation": "Vietnam", "street": "45 Nguyễn Văn Linh", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Nam Dương"}', '{"nation": "Vietnam", "street": "67 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "89 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', 'PHYS', '2022', 'Tạm dừng học', '2022008', 'CLC', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('3bf5085e-490c-4652-b4e3-ced6bd371cdd', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Nguyễn Đức Dũng', '2000-11-25', 'dungnguyen@student.university.edu.vn', '0911123456', 'Vietnam', '{"nation": "Vietnam", "street": "23 Trần Nhân Tông", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Lê Đại Hành"}', '{"nation": "Vietnam", "street": "45 Bạch Mai", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Bạch Mai"}', '{"nation": "Vietnam", "street": "67 Trần Đại Nghĩa", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Đồng Tâm"}', 'GEO', '2019', 'Đã thôi học', '2019014', 'CQ', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('9f15e290-5d2d-4ba8-84a3-bbad0a9ed445', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Trần Thị Hương', '2001-05-30', 'huongtran@student.university.edu.vn', '0988999777', 'Vietnam', '{"nation": "Vietnam", "street": "89 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', '{"nation": "Vietnam", "street": "12 Nguyễn Văn Linh", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "34 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'GEO', '2020', 'Bảo lưu', '2020015', 'CLC', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('381a75d8-6f2e-4281-a794-abd76d34347e', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Lý Văn Hùng', '2002-08-17', 'hungly@student.university.edu.vn', '0977666555', 'Vietnam', '{"nation": "Vietnam", "street": "45 Lê Thanh Nghị", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Đồng Tâm"}', '{"nation": "Vietnam", "street": "67 Trần Đại Nghĩa", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Đồng Tâm"}', '{"nation": "Vietnam", "street": "89 Bạch Mai", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Bạch Mai"}', 'MATH', '2021', 'Đang học', '2021016', 'TT', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('8d8930e9-a9a2-405d-8a1d-40abb76943a6', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Võ Thị Lan', '2001-04-12', 'lanvo@student.university.edu.vn', '0966555888', 'Vietnam', '{"nation": "Vietnam", "street": "12 Nguyễn Thị Minh Khai", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', '{"nation": "Vietnam", "street": "34 Điện Biên Phủ", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', '{"nation": "Vietnam", "street": "56 Lê Duẩn", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Nghé"}', 'MATH', '2020', 'Tốt nghiệp', '2020017', 'CQ', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('ab515880-939e-44b5-9af7-8819108dc29f', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Đinh Văn Minh', '2003-01-28', 'minhdinh@student.university.edu.vn', '0911888999', 'Vietnam', '{"nation": "Vietnam", "street": "78 Hoàng Diệu", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Quán Thánh"}', '{"nation": "Vietnam", "street": "90 Ngọc Hà", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Đội Cấn"}', '{"nation": "Vietnam", "street": "12 Vạn Phúc", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', 'MATH', '2022', 'Đang học', '2022018', 'CLC', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('af1c3504-4dbe-45b3-adc6-b098aed58afc', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Phan Thị Nga', '2000-10-05', 'ngaphan@student.university.edu.vn', '0988777666', 'Vietnam', '{"nation": "Vietnam", "street": "23 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "45 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', '{"nation": "Vietnam", "street": "67 Hùng Vương", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'MATH', '2019', 'Đã thôi học', '2019019', 'CQ', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('6a31ce44-a458-4482-bb05-a6a02282111c', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Trịnh Văn Phúc', '2001-07-15', 'phuctrinh@student.university.edu.vn', '0977999888', 'Vietnam', '{"nation": "Vietnam", "street": "56 Nguyễn Văn Linh", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Nam Dương"}', '{"nation": "Vietnam", "street": "78 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "90 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', 'MATH', '2020', 'Tạm dừng học', '2020020', 'TT', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('961cfba8-678b-4b04-acc0-1941dadf930c', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Hồ Văn Quân', '2002-02-20', 'quanho@student.university.edu.vn', '0966888999', 'Vietnam', '{"nation": "Vietnam", "street": "12 Lê Lợi", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', '{"nation": "Vietnam", "street": "34 Trần Hưng Đạo", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Hoàn Kiếm"}', '{"nation": "Vietnam", "street": "56 Phạm Ngũ Lão", "district": "Cầu Giấy", "city_province": "Hà Nội", "wards_communes": "Cầu Giấy"}', 'ECE', '2021', 'Đang học', '2021021', 'CLC', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('22065dd0-1725-46bb-976e-5a52b13236cf', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Lưu Thị Hồng', '2001-11-11', 'hongluu@student.university.edu.vn', '0911999888', 'Vietnam', '{"nation": "Vietnam", "street": "78 Nguyễn Du", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Nghé"}', '{"nation": "Vietnam", "street": "90 Lê Duẩn", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Thành"}', '{"nation": "Vietnam", "street": "12 Nguyễn Thị Minh Khai", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', 'ECE', '2020', 'Đang học', '2020022', 'CQ', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('62bef0ea-8f46-4fd6-8f19-4763c58430aa', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Chu Văn Sơn', '2003-03-03', 'sonchu@student.university.edu.vn', '0988111222', 'Vietnam', '{"nation": "Vietnam", "street": "34 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "56 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', '{"nation": "Vietnam", "street": "78 Hùng Vương", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'ECE', '2022', 'Đình chỉ', '2022023', 'TT', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('305c99c5-93d4-4626-99a4-7583542c8aa7', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Dương Thị Tuyết', '2000-09-09', 'tuyetduong@student.university.edu.vn', '0977222333', 'Vietnam', '{"nation": "Vietnam", "street": "90 Hoàng Diệu", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Quán Thánh"}', '{"nation": "Vietnam", "street": "12 Ngọc Hà", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Đội Cấn"}', '{"nation": "Vietnam", "street": "34 Vạn Phúc", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', 'ECE', '2019', 'Tốt nghiệp', '2019024', 'CQ', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('d9b9ca02-af79-4be0-b919-b4d1e64d49e7', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Mai Văn Thắng', '2001-06-06', 'thangmai@student.university.edu.vn', '0966333444', 'Vietnam', '{"nation": "Vietnam", "street": "56 Nguyễn Văn Linh", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Nam Dương"}', '{"nation": "Vietnam", "street": "78 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "90 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', 'ECE', '2020', 'Bảo lưu', '2020025', 'CLC', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('9d22c46d-50b6-4b2d-a7b2-9afdafb6d8e9', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Ngô Thị Uyên', '2002-07-07', 'uyenngo@student.university.edu.vn', '0911444555', 'Vietnam', '{"nation": "Vietnam", "street": "12 Lê Thanh Nghị", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Đồng Tâm"}', '{"nation": "Vietnam", "street": "34 Trần Đại Nghĩa", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Đồng Tâm"}', '{"nation": "Vietnam", "street": "56 Bạch Mai", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Bạch Mai"}', 'MATE', '2021', 'Đang học', '2021026', 'TT', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('97feb39a-d8e1-491b-996f-f7c86335de0b', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Phùng Văn Vinh', '2001-04-04', 'vinhphung@student.university.edu.vn', '0988555666', 'Vietnam', '{"nation": "Vietnam", "street": "78 Nguyễn Thị Minh Khai", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', '{"nation": "Vietnam", "street": "90 Điện Biên Phủ", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', '{"nation": "Vietnam", "street": "12 Lê Duẩn", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Nghé"}', 'MATE', '2020', 'Đang học', '2020027', 'CQ', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('a955416b-6b4d-4ca7-b3eb-8c7c2bcd8f41', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Vương Thị Xuân', '2003-01-01', 'xuanvuong@student.university.edu.vn', '0977444555', 'Vietnam', '{"nation": "Vietnam", "street": "34 Hoàng Diệu", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Quán Thánh"}', '{"nation": "Vietnam", "street": "56 Ngọc Hà", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Đội Cấn"}', '{"nation": "Vietnam", "street": "78 Vạn Phúc", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', 'MATE', '2022', 'Tạm dừng học', '2022028', 'CLC', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('082ad872-093b-40e3-981b-4ed49221e27e', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Đỗ Văn Yên', '2000-12-12', 'yendo@student.university.edu.vn', '0966222111', 'Vietnam', '{"nation": "Vietnam", "street": "90 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "12 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', '{"nation": "Vietnam", "street": "34 Hùng Vương", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'MATE', '2019', 'Đã thôi học', '2019029', 'CQ', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('eba00634-a79b-46c0-8e73-6caa8f64e09b', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Lâm Thị Ánh', '2001-05-05', 'anhlam@student.university.edu.vn', '0911333222', 'Vietnam', '{"nation": "Vietnam", "street": "56 Nguyễn Văn Linh", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Nam Dương"}', '{"nation": "Vietnam", "street": "78 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "90 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', 'MATE', '2020', 'Tốt nghiệp', '2020030', 'TT', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('f26d17e4-3aaf-42dd-844c-fced0075dd7c', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Trương Văn Bình', '2002-08-08', 'binhtruong@student.university.edu.vn', '0988444333', 'Vietnam', '{"nation": "Vietnam", "street": "12 Lê Lợi", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', '{"nation": "Vietnam", "street": "34 Trần Hưng Đạo", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Hoàn Kiếm"}', '{"nation": "Vietnam", "street": "56 Phạm Ngũ Lão", "district": "Cầu Giấy", "city_province": "Hà Nội", "wards_communes": "Cầu Giấy"}', 'CHEM', '2021', 'Đang học', '2021031', 'CLC', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('c8bba8ca-d929-45d8-ba42-a477bb534627', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Nguyễn Thị Cúc', '2001-03-03', 'cucnguyen@student.university.edu.vn', '0977555444', 'Vietnam', '{"nation": "Vietnam", "street": "78 Nguyễn Du", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Nghé"}', '{"nation": "Vietnam", "street": "90 Lê Duẩn", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Thành"}', '{"nation": "Vietnam", "street": "12 Nguyễn Thị Minh Khai", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', 'CHEM', '2020', 'Đang học', '2020032', 'CQ', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('aa90fbe3-d43c-4bd0-b2b2-2bf189021d14', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Hà Văn Dũng', '2003-02-02', 'dungha@student.university.edu.vn', '0966444555', 'Vietnam', '{"nation": "Vietnam", "street": "34 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "56 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', '{"nation": "Vietnam", "street": "78 Hùng Vương", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'CHEM', '2022', 'Đình chỉ', '2022033', 'TT', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('4a7936e8-f58e-46d9-86ef-6a52cb361149', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Lê Thị Hạnh', '2000-11-11', 'hanhle@student.university.edu.vn', '0911222333', 'Vietnam', '{"nation": "Vietnam", "street": "90 Hoàng Diệu", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Quán Thánh"}', '{"nation": "Vietnam", "street": "12 Ngọc Hà", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Đội Cấn"}', '{"nation": "Vietnam", "street": "34 Vạn Phúc", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', 'CHEM', '2019', 'Tốt nghiệp', '2019034', 'CQ', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('9e546370-9cbf-4e91-b8f7-a74d3b0acd4d', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Phan Văn Khải', '2001-06-06', 'khaiphan@student.university.edu.vn', '0988333444', 'Vietnam', '{"nation": "Vietnam", "street": "56 Nguyễn Văn Linh", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Nam Dương"}', '{"nation": "Vietnam", "street": "78 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "90 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', 'CHEM', '2020', 'Bảo lưu', '2020035', 'CLC', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('c4b17afa-0c60-4ac8-8757-4cc4f6fe02a0', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Võ Thị Lan Anh', '2002-07-07', 'anhvo@student.university.edu.vn', '0977666555', 'Vietnam', '{"nation": "Vietnam", "street": "12 Lê Thanh Nghị", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Đồng Tâm"}', '{"nation": "Vietnam", "street": "34 Trần Đại Nghĩa", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Đồng Tâm"}', '{"nation": "Vietnam", "street": "56 Bạch Mai", "district": "Hai Bà Trưng", "city_province": "Hà Nội", "wards_communes": "Bạch Mai"}', 'BIO', '2021', 'Đang học', '2021036', 'TT', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('7db9e40c-d8d0-4554-abfd-77852ed11ec5', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Trần Văn Minh', '2001-04-04', 'minhtran@student.university.edu.vn', '0966555444', 'Vietnam', '{"nation": "Vietnam", "street": "78 Nguyễn Thị Minh Khai", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', '{"nation": "Vietnam", "street": "90 Điện Biên Phủ", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', '{"nation": "Vietnam", "street": "12 Lê Duẩn", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Nghé"}', 'BIO', '2020', 'Đang học', '2020037', 'CQ', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('8e6f0527-0361-484a-9f77-74d380852f74', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Nguyễn Thị Ngọc', '2003-01-01', 'ngocnguyen@student.university.edu.vn', '0911444333', 'Vietnam', '{"nation": "Vietnam", "street": "34 Hoàng Diệu", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Quán Thánh"}', '{"nation": "Vietnam", "street": "56 Ngọc Hà", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Đội Cấn"}', '{"nation": "Vietnam", "street": "78 Vạn Phúc", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', 'BIO', '2022', 'Tạm dừng học', '2022038', 'CLC', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('fb3074e2-9bb3-41e7-bca8-14dc5f5c28a2', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Đặng Văn Phong', '2000-12-12', 'phongdang@student.university.edu.vn', '0988222111', 'Vietnam', '{"nation": "Vietnam", "street": "90 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "12 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', '{"nation": "Vietnam", "street": "34 Hùng Vương", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'BIO', '2019', 'Đã thôi học', '2019039', 'CQ', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('02cb3941-cc8e-4961-9085-bd431cca9a6f', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Lê Thị Quỳnh', '2001-05-05', 'quynhle@student.university.edu.vn', '0977333222', 'Vietnam', '{"nation": "Vietnam", "street": "56 Nguyễn Văn Linh", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Nam Dương"}', '{"nation": "Vietnam", "street": "78 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "90 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', 'BIO', '2020', 'Tốt nghiệp', '2020040', 'TT', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('9b0b863c-a33a-4d0d-8c96-2d70f2cf49b1', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Hoàng Văn Sơn', '2002-08-08', 'sonhoang@student.university.edu.vn', '0911555444', 'Vietnam', '{"nation": "Vietnam", "street": "12 Lê Lợi", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', '{"nation": "Vietnam", "street": "34 Trần Hưng Đạo", "district": "Hoàn Kiếm", "city_province": "Hà Nội", "wards_communes": "Hoàn Kiếm"}', '{"nation": "Vietnam", "street": "56 Phạm Ngũ Lão", "district": "Cầu Giấy", "city_province": "Hà Nội", "wards_communes": "Cầu Giấy"}', 'ENV', '2021', 'Đang học', '2021041', 'CLC', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('b4a43ec9-ec09-4c46-bd0d-50c0d3a73e4b', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Vũ Thị Thanh', '2001-03-03', 'thanhvu@student.university.edu.vn', '0988444555', 'Vietnam', '{"nation": "Vietnam", "street": "78 Nguyễn Du", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Nghé"}', '{"nation": "Vietnam", "street": "90 Lê Duẩn", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Bến Thành"}', '{"nation": "Vietnam", "street": "12 Nguyễn Thị Minh Khai", "district": "Quận 1", "city_province": "TP HCM", "wards_communes": "Đa Kao"}', 'ENV', '2020', 'Đang học', '2020042', 'CQ', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('9efddd2e-6527-43bd-b5da-bb0f18378228', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Trịnh Văn Tuấn', '2003-02-02', 'tuantrinh@student.university.edu.vn', '0977555666', 'Vietnam', '{"nation": "Vietnam", "street": "34 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "56 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', '{"nation": "Vietnam", "street": "78 Hùng Vương", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', 'ENV', '2022', 'Đình chỉ', '2022043', 'TT', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('6eec62d1-12b0-466e-94de-c6ad6ad18d01', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Ngô Thị Uyển', '2000-11-11', 'uyenngo2@student.university.edu.vn', '0966222333', 'Vietnam', '{"nation": "Vietnam", "street": "90 Hoàng Diệu", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Quán Thánh"}', '{"nation": "Vietnam", "street": "12 Ngọc Hà", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Đội Cấn"}', '{"nation": "Vietnam", "street": "34 Vạn Phúc", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', 'ENV', '2019', 'Tốt nghiệp', '2019044', 'CQ', 'Nữ');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('44f6ce71-cb8e-4e50-a91b-df1e6b153454', '2025-06-14 16:33:42.195055+00', '2025-06-14 16:33:42.195055+00', 'Đinh Văn Vũ', '2001-06-06', 'vudinh@student.university.edu.vn', '0911333444', 'Vietnam', '{"nation": "Vietnam", "street": "56 Nguyễn Văn Linh", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Nam Dương"}', '{"nation": "Vietnam", "street": "78 Trần Phú", "district": "Hải Châu", "city_province": "Đà Nẵng", "wards_communes": "Hải Châu"}', '{"nation": "Vietnam", "street": "90 Lê Duẩn", "district": "Thanh Khê", "city_province": "Đà Nẵng", "wards_communes": "Thanh Khê"}', 'ENV', '2020', 'Bảo lưu', '2020045', 'CLC', 'Nam');
INSERT INTO public.students (id, created_at, updated_at, full_name, date_of_birth, email, phone_number, nationality, mail_address, permanent_address, temporary_residence_address, faculty_code, cohort_year, status, student_code, program_code, gender) VALUES ('a6814b94-0d30-4938-a4b9-dd2715e4f4fc', '2025-06-14 16:33:42.195055+00', '2025-06-15 15:51:00.214+00', 'Phạm Văn Long', '2000-12-15', 'longpham@student.university.edu.vn', '+847728213', 'Vietnam', '{"nation": "Vietnam", "street": "23 Hoàng Diệu", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Quán Thánh"}', '{"nation": "Vietnam", "street": "45 Ngọc Hà", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Đội Cấn"}', '{"nation": "Vietnam", "street": "67 Vạn Phúc", "district": "Ba Đình", "city_province": "Hà Nội", "wards_communes": "Ba Đình"}', 'PHYS', '2019', 'Tốt nghiệp', '2019009', 'CQ', 'Nữ');


--
-- Data for Name: class_registrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021001', 'MT21120', 8.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021001', 'CS04120', 7.2, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021001', 'BA03120', 6.8, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020002', 'MT35120', 9.1, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020002', 'MT22220', 8.7, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020002', 'BA04220', 7.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020006', 'MT21120', 7.8, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020006', 'BA11220', 6.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020006', 'BA21220', 8, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020010', 'MT45220', 5.4, 'Thi lại', false);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020010', 'BA12220', 4.9, 'Học cải thiện', false);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021011', 'MT35121', 8.2, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021011', 'BA13121', 7, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021011', 'BA10221', 6.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020015', 'MT22221', 7.8, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020015', 'BA14221', 8.1, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021016', 'MT50221', 9.2, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021016', 'BA10321', 8.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021016', 'MT44321', 9, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020020', 'MT21122', 6, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020020', 'CS04122', 5.5, 'Qua điểm tối thiểu', true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021021', 'MT35122', 7.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021021', 'BA03122', 6.8, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021021', 'BA22221', 8.2, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020025', 'MT21121', 4.5, 'Học lại', false);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021026', 'MT35120', 8.7, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021026', 'BA04220', 7.8, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020030', 'MT44320', 6.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020030', 'BA10421', 7.2, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021031', 'MT21120', 7, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021031', 'BA11220', 6.8, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020035', 'MT22221', 5, 'Qua điểm tối thiểu', true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021036', 'MT35121', 8.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021036', 'BA13121', 7.8, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020040', 'MT50221', 9, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021041', 'MT21122', 7.2, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2021041', 'CS04122', 6.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 16:47:45.201996+00', '2025-06-14 16:47:45.201996+00', '2020045', 'MT35122', 5.8, 'Qua điểm tối thiểu', true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 18:45:58.544547+00', '2025-06-14 18:45:58.544547+00', '2021001', 'MT21120B', NULL, 'Đăng ký học thêm', NULL);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 18:45:58.544547+00', '2025-06-14 18:45:58.544547+00', '2020002', 'MT35121B', 8.2, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 18:45:58.544547+00', '2025-06-14 18:45:58.544547+00', '2020025', 'MT21121R', 7.5, 'Học lại - Đã qua', true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 18:45:58.544547+00', '2025-06-14 18:45:58.544547+00', '2020010', 'MT21121R', 6, 'Học lại - Đã qua', true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 18:45:58.544547+00', '2025-06-14 18:45:58.544547+00', '2021036', 'CS04122B', NULL, 'Học cải thiện', NULL);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 18:45:58.544547+00', '2025-06-14 18:45:58.544547+00', '2020040', 'MT35121B', 8.8, 'Học nâng cao', true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 18:45:58.544547+00', '2025-06-14 18:45:58.544547+00', '2021011', 'MT21120B', 6.5, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 18:45:58.544547+00', '2025-06-14 18:45:58.544547+00', '2021021', 'MT35121B', 7.2, NULL, true);
INSERT INTO public.class_registrations (created_at, updated_at, student_code, class_code, grade, note, is_pass) VALUES ('2025-06-14 18:45:58.544547+00', '2025-06-14 18:45:58.544547+00', '2020035', 'MT21121R', 5.5, 'Học lại - Vừa đủ', true);


--
-- Data for Name: identity_documents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116024918, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116045059, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116050929, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116051442, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116212300, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116213355, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116213934, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116214523, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211122062447, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211124070109, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211202204204, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211202204605, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211210212804, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211228014915, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220107221237, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220228202821, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220312004840, '2025-03-30 14:31:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220603231003, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220603232444, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220615214548, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220712093339, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220908172859, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220916233421, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230119133233, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230128025114, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230128025212, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230227211149, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230228184745, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230308225145, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230328144023, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231018144023, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144023, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144024, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144025, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240108234812, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240109165339, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240227174441, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240311171622, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240321100241, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240401105812, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240418121054, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240523004032, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240618124746, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240801235015, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240805133720, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240827160934, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240919163303, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240919163305, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241019105805, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241030150047, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241108114728, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241121104152, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241130184212, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241220035512, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241220123912, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241224161212, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250107150512, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250110162412, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250123174212, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250128220012, '2025-03-30 14:31:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250506224012, '2025-05-26 15:49:33');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250523164012, '2025-06-04 04:37:45');


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2025-03-30 14:31:52.364954');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (1, 'initialmigration', '6ab16121fbaa08bbd11b712d05f358f9b555d777', '2025-03-30 14:31:52.373887');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (2, 'storage-schema', '5c7968fd083fcea04050c1b7f6253c9771b99011', '2025-03-30 14:31:52.378138');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (3, 'pathtoken-column', '2cb1b0004b817b29d5b0a971af16bafeede4b70d', '2025-03-30 14:31:52.40847');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (4, 'add-migrations-rls', '427c5b63fe1c5937495d9c635c263ee7a5905058', '2025-03-30 14:31:52.434696');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (5, 'add-size-functions', '79e081a1455b63666c1294a440f8ad4b1e6a7f84', '2025-03-30 14:31:52.446529');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (6, 'change-column-name-in-get-size', 'f93f62afdf6613ee5e7e815b30d02dc990201044', '2025-03-30 14:31:52.453327');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (7, 'add-rls-to-buckets', 'e7e7f86adbc51049f341dfe8d30256c1abca17aa', '2025-03-30 14:31:52.463839');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (8, 'add-public-to-buckets', 'fd670db39ed65f9d08b01db09d6202503ca2bab3', '2025-03-30 14:31:52.473648');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (9, 'fix-search-function', '3a0af29f42e35a4d101c259ed955b67e1bee6825', '2025-03-30 14:31:52.478189');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (10, 'search-files-search-function', '68dc14822daad0ffac3746a502234f486182ef6e', '2025-03-30 14:31:52.486355');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (11, 'add-trigger-to-auto-update-updated_at-column', '7425bdb14366d1739fa8a18c83100636d74dcaa2', '2025-03-30 14:31:52.509017');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (12, 'add-automatic-avif-detection-flag', '8e92e1266eb29518b6a4c5313ab8f29dd0d08df9', '2025-03-30 14:31:52.523477');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (13, 'add-bucket-custom-limits', 'cce962054138135cd9a8c4bcd531598684b25e7d', '2025-03-30 14:31:52.528423');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (14, 'use-bytes-for-max-size', '941c41b346f9802b411f06f30e972ad4744dad27', '2025-03-30 14:31:52.535049');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (15, 'add-can-insert-object-function', '934146bc38ead475f4ef4b555c524ee5d66799e5', '2025-03-30 14:31:52.592604');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (16, 'add-version', '76debf38d3fd07dcfc747ca49096457d95b1221b', '2025-03-30 14:31:52.598371');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (17, 'drop-owner-foreign-key', 'f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101', '2025-03-30 14:31:52.60323');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (18, 'add_owner_id_column_deprecate_owner', 'e7a511b379110b08e2f214be852c35414749fe66', '2025-03-30 14:31:52.611688');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (19, 'alter-default-value-objects-id', '02e5e22a78626187e00d173dc45f58fa66a4f043', '2025-03-30 14:31:52.6342');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (20, 'list-objects-with-delimiter', 'cd694ae708e51ba82bf012bba00caf4f3b6393b7', '2025-03-30 14:31:52.651156');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (21, 's3-multipart-uploads', '8c804d4a566c40cd1e4cc5b3725a664a9303657f', '2025-03-30 14:31:52.663708');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (22, 's3-multipart-uploads-big-ints', '9737dc258d2397953c9953d9b86920b8be0cdb73', '2025-03-30 14:31:52.701205');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (23, 'optimize-search-function', '9d7e604cddc4b56a5422dc68c9313f4a1b6f132c', '2025-03-30 14:31:52.728275');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (24, 'operation-function', '8312e37c2bf9e76bbe841aa5fda889206d2bf8aa', '2025-03-30 14:31:52.735554');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (25, 'custom-metadata', 'd974c6057c3db1c1f847afa0e291e6165693b990', '2025-03-30 14:31:52.743166');


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: -
--

SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);


--
-- Name: course_registration_period_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.course_registration_period_id_seq', 6, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

