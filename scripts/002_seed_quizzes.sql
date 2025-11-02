-- Insert sample quizzes
insert into public.quizzes (title, category, description, questions, reward_points) values
(
  'Matemática Básica',
  'matemática',
  'Teste seus conhecimentos em matemática básica',
  jsonb_build_array(
    jsonb_build_object(
      'id', 1,
      'question', 'Quanto é 2 + 2?',
      'options', jsonb_build_array('3', '4', '5', '6'),
      'correct', 1
    ),
    jsonb_build_object(
      'id', 2,
      'question', 'Quanto é 10 × 5?',
      'options', jsonb_build_array('40', '50', '60', '70'),
      'correct', 1
    ),
    jsonb_build_object(
      'id', 3,
      'question', 'Quanto é 100 ÷ 4?',
      'options', jsonb_build_array('20', '25', '30', '35'),
      'correct', 1
    )
  ),
  15
),
(
  'Conhecimento Geral',
  'conhecimento',
  'Perguntas sobre sua cidade e região',
  jsonb_build_array(
    jsonb_build_object(
      'id', 1,
      'question', 'Qual é a capital do Brasil?',
      'options', jsonb_build_array('Rio de Janeiro', 'Brasília', 'Salvador', 'Belo Horizonte'),
      'correct', 1
    ),
    jsonb_build_object(
      'id', 2,
      'question', 'Em que continente fica o Brasil?',
      'options', jsonb_build_array('África', 'Europa', 'Ásia', 'América do Sul'),
      'correct', 3
    )
  ),
  12
),
(
  'Governo Brasileiro',
  'política',
  'Teste seus conhecimentos sobre o governo',
  jsonb_build_array(
    jsonb_build_object(
      'id', 1,
      'question', 'O Brasil é uma república?',
      'options', jsonb_build_array('Sim', 'Não', 'Parcialmente', 'Não tenho certeza'),
      'correct', 0
    ),
    jsonb_build_object(
      'id', 2,
      'question', 'Quantos anos dura um mandato presidencial?',
      'options', jsonb_build_array('2', '3', '4', '6'),
      'correct', 2
    )
  ),
  12
);
