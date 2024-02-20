export interface Category {
    name: string;
    image?: string;
    subCategory?: Category[];
    linkParam?: string;
  }
  
  export const CATEGORIES: Category[] = [
    {
      name: 'Text Books',
      image: 'assets/images/categories/textbooks.png',
      linkParam: 'Text Books',
      subCategory: [
        {
            name: 'Humanitarian faculties',
            subCategory: [
                {name: "School of Arts"},
                {name: "School of Business"},
                {name: "School of Sharia"},
                {name: "School of Educational Sciences"},
                {name: "School of Law"},
                {name: "School of Physical Education"},
                {name: "School of Arts and Design"},
                {name: "School of International Studies"},
                {name: "School of Foreign languages"},
                {name: "School of Archaeology and Tourism"},
            ]
        },
        {
            name: 'Scientific faculties',
            subCategory: [
                {name: "School of Science"},
                {name: "School of Agriculture"},
                {name: "School of Engineering"},
                {name: "King Abdullah II School for Information Technology"},
            ]
        },
        {
            name: 'Medical faculties',
            subCategory: [
                {name: "School of Nursing"},
                {name: "School of Medicine"},
                {name: "School of Pharmacy"},
                {name: "School of Dentistry"},
                {name: "School of Rehabilitation Sciences"},
            ]
        }
      ]
    },
    {
      name: 'Uniforms',
      image: 'assets/images/categories/uniforms.png',
      linkParam: 'Uniforms',
      subCategory: [
        {name: "Medical Uniforms"},
        {name: "Art Uniforms"},
        {name: "Science Uniforms"}
      ]
    },
    {
      name: 'Tools',
      image: 'assets/images/categories/tools.png',
      linkParam: 'Tools',
      subCategory: [
        {name: "Medical Tools"},
        {name: "Engineering Tools"},
        {name: "Science Tools"},
        {name: "Electronic Tools"},
        {name: "Art Tools"}
      ]
    },
    // Add more categories as needed
  ];