// Все вопросы и скрытые баллы хранятся отдельно от логики сайта.
// Каждый score — объект: направление → количество баллов за ответ.
const questions = [
  {
    text: "Какие школьные предметы тебе нравятся больше всего?",
    answers: [
      { text: "Математика и информатика", score: { it: 1, finance: 1, engineering: 1 } },
      { text: "Русский язык и литература", score: { media: 1, education: 1, psychology: 1 } },
      { text: "Биология и химия", score: { medicine: 1, science: 1 } },
      { text: "История и обществознание", score: { law: 1, government: 1, psychology: 1 } },
      { text: "Физика", score: { engineering: 1, it: 1, science: 1 } },
      { text: "Искусство и творчество", score: { design: 1, media: 1, marketing: 1 } }
    ]
  },
  {
    text: "Что тебе больше нравится делать?",
    answers: [
      { text: "Решать сложные задачи", score: { it: 1, engineering: 1, science: 1, finance: 1 } },
      { text: "Общаться с людьми", score: { psychology: 1, marketing: 1, education: 1 } },
      { text: "Создавать что-то новое", score: { design: 1, it: 1, engineering: 1, media: 1 } },
      { text: "Анализировать информацию", score: { finance: 1, science: 1, it: 1 } },
      { text: "Организовывать людей", score: { business: 1, government: 1, marketing: 1 } },
      { text: "Помогать другим", score: { medicine: 1, psychology: 1, education: 1 } }
    ]
  },
  {
    text: "Как тебе комфортнее работать?",
    answers: [
      { text: "Самостоятельно", score: { it: 1, science: 1, design: 1 } },
      { text: "В команде", score: { business: 1, marketing: 1, engineering: 1 } },
      { text: "Руководить командой", score: { business: 1, government: 1, marketing: 1 } },
      { text: "Не имеет значения", score: { psychology: 1, education: 1, finance: 1 } }
    ]
  },
  {
    text: "Что тебе ближе?",
    answers: [
      { text: "Технологии", score: { it: 1, engineering: 1 } },
      { text: "Бизнес", score: { business: 1, finance: 1, marketing: 1 } },
      { text: "Наука", score: { science: 1, medicine: 1 } },
      { text: "Творчество", score: { design: 1, media: 1 } },
      { text: "Медицина", score: { medicine: 1, psychology: 1 } },
      { text: "Право", score: { law: 1, government: 1 } },
      { text: "Медиа", score: { media: 1, marketing: 1 } }
    ]
  },
  {
    text: "Что тебе интереснее?",
    answers: [
      { text: "Создать приложение", score: { it: 1, engineering: 1 } },
      { text: "Организовать мероприятие", score: { business: 1, marketing: 1, media: 1 } },
      { text: "Провести исследование", score: { science: 1, medicine: 1 } },
      { text: "Создать дизайн", score: { design: 1, marketing: 1 } },
      { text: "Помочь человеку", score: { medicine: 1, psychology: 1, education: 1 } },
      { text: "Написать статью", score: { media: 1, education: 1 } }
    ]
  },
  {
    text: "Как ты обычно решаешь проблемы?",
    answers: [
      { text: "Логически анализирую ситуацию", score: { it: 1, finance: 1, science: 1 } },
      { text: "Придумываю необычное решение", score: { design: 1, marketing: 1, engineering: 1 } },
      { text: "Советуюсь с людьми", score: { psychology: 1, education: 1, business: 1 } },
      { text: "Сразу пробую разные варианты", score: { engineering: 1, business: 1, it: 1 } }
    ]
  },
  {
    text: "Что для тебя важнее в будущей профессии?",
    answers: [
      { text: "Высокий доход", score: { finance: 1, business: 1, it: 1 } },
      { text: "Интересная работа", score: { science: 1, design: 1, media: 1 } },
      { text: "Стабильность", score: { government: 1, education: 1, medicine: 1 } },
      { text: "Возможность помогать людям", score: { medicine: 1, psychology: 1, education: 1 } },
      { text: "Свобода и самостоятельность", score: { business: 1, design: 1, it: 1 } },
      { text: "Карьерный рост", score: { business: 1, government: 1, marketing: 1 } }
    ]
  },
  {
    text: "Какой результат работы приносит тебе больше удовлетворения?",
    answers: [
      { text: "Работающий продукт", score: { it: 1, engineering: 1 } },
      { text: "Решённая задача", score: { finance: 1, science: 1, it: 1 } },
      { text: "Довольный человек", score: { psychology: 1, medicine: 1, education: 1 } },
      { text: "Красивый результат", score: { design: 1, media: 1, marketing: 1 } },
      { text: "Полезное открытие", score: { science: 1, medicine: 1, engineering: 1 } }
    ]
  },
  {
    text: "Как ты относишься к выступлениям перед людьми?",
    answers: [
      { text: "Люблю выступать", score: { marketing: 1, media: 1, business: 1, education: 1 } },
      { text: "Могу, если нужно", score: { government: 1, psychology: 1, business: 1 } },
      { text: "Предпочитаю писать или создавать за кадром", score: { it: 1, design: 1, science: 1 } },
      { text: "Хочу научиться", score: { education: 1, marketing: 1, psychology: 1 } }
    ]
  },
  {
    text: "Что тебе проще даётся?",
    answers: [
      { text: "Работа с числами", score: { finance: 1, it: 1, science: 1 } },
      { text: "Работа с текстом", score: { media: 1, law: 1, education: 1 } },
      { text: "Работа с людьми", score: { psychology: 1, marketing: 1, medicine: 1 } },
      { text: "Работа с визуалом", score: { design: 1, marketing: 1, media: 1 } },
      { text: "Работа с техникой", score: { engineering: 1, it: 1 } }
    ]
  },
  {
    text: "Если тебе дали свободный проект, что ты выберешь?",
    answers: [
      { text: "Сделать сайт или приложение", score: { it: 1, engineering: 1 } },
      { text: "Создать исследование", score: { science: 1, medicine: 1 } },
      { text: "Запустить мини-бизнес", score: { business: 1, finance: 1, marketing: 1 } },
      { text: "Снять видео", score: { media: 1, marketing: 1 } },
      { text: "Разработать визуальный стиль", score: { design: 1, marketing: 1 } }
    ]
  },
  {
    text: "Как ты относишься к риску?",
    answers: [
      { text: "Готов пробовать новое", score: { business: 1, it: 1, marketing: 1 } },
      { text: "Люблю осторожные решения", score: { finance: 1, science: 1 } },
      { text: "Риск зависит от цели", score: { engineering: 1, business: 1, government: 1 } },
      { text: "Предпочитаю стабильность", score: { government: 1, education: 1, medicine: 1 } }
    ]
  },
  {
    text: "Что тебе интереснее изучать глубже?",
    answers: [
      { text: "Как устроены технологии", score: { it: 1, engineering: 1 } },
      { text: "Как устроен человек", score: { medicine: 1, psychology: 1, science: 1 } },
      { text: "Как работает общество", score: { law: 1, government: 1, psychology: 1 } },
      { text: "Как работает экономика", score: { finance: 1, business: 1 } },
      { text: "Как устроен окружающий мир", score: { science: 1, engineering: 1 } }
    ]
  },
  {
    text: "Какой рабочий день кажется тебе интереснее?",
    answers: [
      { text: "За компьютером над сложной задачей", score: { it: 1, finance: 1, science: 1 } },
      { text: "В лаборатории", score: { science: 1, medicine: 1 } },
      { text: "Встречи и переговоры", score: { business: 1, marketing: 1, law: 1 } },
      { text: "Создание контента", score: { media: 1, design: 1, marketing: 1 } },
      { text: "Работа с людьми напрямую", score: { psychology: 1, medicine: 1, education: 1 } }
    ]
  },
  {
    text: "Что ты чаще делаешь, когда видишь несправедливость?",
    answers: [
      { text: "Пытаюсь разобраться в правилах", score: { law: 1, government: 1 } },
      { text: "Обсуждаю проблему с другими", score: { psychology: 1, education: 1 } },
      { text: "Ищу факты и доказательства", score: { science: 1, law: 1, finance: 1 } },
      { text: "Предлагаю практическое решение", score: { engineering: 1, business: 1, government: 1 } }
    ]
  },
  {
    text: "Какой навык ты хотел бы развить сильнее?",
    answers: [
      { text: "Программирование", score: { it: 1, engineering: 1 } },
      { text: "Публичные выступления", score: { media: 1, marketing: 1, education: 1 } },
      { text: "Аналитическое мышление", score: { finance: 1, science: 1, it: 1 } },
      { text: "Креативность", score: { design: 1, media: 1, marketing: 1 } },
      { text: "Умение убеждать", score: { law: 1, business: 1, marketing: 1 } }
    ]
  },
  {
    text: "Как ты обычно учишься новому?",
    answers: [
      { text: "Смотрю, как это работает, и пробую", score: { it: 1, engineering: 1 } },
      { text: "Читаю много материалов", score: { science: 1, law: 1, education: 1 } },
      { text: "Обсуждаю с человеком, который знает", score: { psychology: 1, education: 1, business: 1 } },
      { text: "Делаю собственный проект", score: { business: 1, design: 1, it: 1 } }
    ]
  },
  {
    text: "Какой тип задач тебе ближе?",
    answers: [
      { text: "Есть данные — найди закономерность", score: { finance: 1, science: 1, it: 1 } },
      { text: "Есть проблема — придумай решение", score: { engineering: 1, design: 1, business: 1 } },
      { text: "Есть человек — пойми, чем помочь", score: { psychology: 1, medicine: 1, education: 1 } },
      { text: "Есть идея — расскажи о ней", score: { media: 1, marketing: 1, business: 1 } }
    ]
  },
  {
    text: "Какой вклад в общество тебе был бы интересен?",
    answers: [
      { text: "Создавать новые технологии", score: { it: 1, engineering: 1 } },
      { text: "Развивать науку", score: { science: 1, medicine: 1 } },
      { text: "Помогать людям", score: { medicine: 1, psychology: 1, education: 1 } },
      { text: "Развивать бизнес и рабочие места", score: { business: 1, finance: 1, marketing: 1 } },
      { text: "Защищать права и порядок", score: { law: 1, government: 1 } }
    ]
  },
  {
    text: "Представь, что через 10 лет ты стал экспертом. В чём?",
    answers: [
      { text: "Технологии и данные", score: { it: 1, finance: 1, engineering: 1 } },
      { text: "Люди и коммуникации", score: { psychology: 1, marketing: 1, education: 1 } },
      { text: "Наука и исследования", score: { science: 1, medicine: 1 } },
      { text: "Бизнес и деньги", score: { business: 1, finance: 1 } },
      { text: "Творчество и медиа", score: { design: 1, media: 1, marketing: 1 } },
      { text: "Государство и право", score: { law: 1, government: 1 } }
    ]
  }
];