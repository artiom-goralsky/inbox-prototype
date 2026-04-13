import HomepageTemplate from './templates/HomepageTemplate';
import AboutTemplate from './templates/AboutTemplate';
import ContactTemplate from './templates/ContactTemplate';

export const getTemplateComponent = (templateId: string) => {
  switch (templateId) {
    case 'homepage':
      return HomepageTemplate;
    case 'about':
      return AboutTemplate;
    case 'contact':
      return ContactTemplate;
    default:
      return HomepageTemplate;
  }
};
