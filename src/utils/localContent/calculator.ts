import type { Supplier } from '../../types/warehouse';
import type { ProductionMaterial } from '../../types/production';
import type { LocalContentResult, CategoryBreakdown, CategoryDetail } from './types';

export const calculateLocalContent = (
  suppliers: Supplier[],
  materials: ProductionMaterial[],
  employees: any[] = [],
  services: any[] = []
): LocalContentResult => {
  try {
    // Calculate each category
    const materialsBreakdown = calculateMaterialsContribution(materials);
    const suppliersBreakdown = calculateSuppliersContribution(suppliers);

    // Calculate total percentage
    const totalPercentage = calculateTotalPercentage([materialsBreakdown, suppliersBreakdown]);

    // Generate recommendations
    const recommendations = generateRecommendations([materialsBreakdown, suppliersBreakdown]);

    return {
      totalPercentage,
      categoryBreakdown: [materialsBreakdown, suppliersBreakdown],
      recommendations
    };
  } catch (error) {
    console.error('Error calculating local content:', error);
    throw new Error('فشل في احتساب المحتوى المحلي');
  }
};

// Helper functions
const calculateMaterialsContribution = (materials: ProductionMaterial[]): CategoryBreakdown => {
  const localMaterials = materials.filter(m => 
    ['crushed-rock', 'sand', 'stone-dust'].includes(m.type)
  );

  const totalValue = materials.reduce((sum, m) => sum + m.stockQuantity, 0);
  const localValue = localMaterials.reduce((sum, m) => sum + m.stockQuantity, 0);
  const percentage = (localValue / totalValue) * 100;

  return {
    category: 'المواد الأولية',
    current: Math.round(percentage),
    target: 40,
    status: percentage >= 40 ? 'compliant' : 'non-compliant',
    details: materials.map(m => ({
      item: m.name,
      percentage: (m.stockQuantity / totalValue) * 100,
      contribution: ['crushed-rock', 'sand', 'stone-dust'].includes(m.type) ? 100 : 0
    }))
  };
};

const calculateSuppliersContribution = (suppliers: Supplier[]): CategoryBreakdown => {
  const localSuppliers = suppliers.filter(s => s.type === 'local');
  const percentage = (localSuppliers.length / suppliers.length) * 100;

  return {
    category: 'الموردين',
    current: Math.round(percentage),
    target: 30,
    status: percentage >= 30 ? 'compliant' : 'non-compliant',
    details: suppliers.map(s => ({
      item: s.name,
      percentage: (1 / suppliers.length) * 100,
      contribution: s.type === 'local' ? 100 : 0
    }))
  };
};

const calculateTotalPercentage = (categories: CategoryBreakdown[]): number => {
  const total = categories.reduce((sum, category) => sum + category.current, 0);
  return Math.round(total / categories.length);
};

const generateRecommendations = (categories: CategoryBreakdown[]): string[] => {
  const recommendations: string[] = [];

  categories.forEach(category => {
    if (category.status === 'non-compliant') {
      const gap = category.target - category.current;
      
      switch (category.category) {
        case 'المواد الأولية':
          recommendations.push(
            `زيادة نسبة المواد المحلية في ${category.category} بمقدار ${gap.toFixed(1)}% للوصول للنسبة المستهدفة`,
            'البحث عن موردين محليين للمواد الأولية',
            'تطوير القدرات المحلية لإنتاج المواد الأولية'
          );
          break;
          
        case 'الموردين':
          recommendations.push(
            `زيادة عدد الموردين المحليين في ${category.category} بمقدار ${gap.toFixed(1)}% للوصول للنسبة المستهدفة`,
            'تأهيل موردين محليين جدد',
            'تقديم برامج تطوير للموردين المحليين'
          );
          break;
      }
    }
  });

  return recommendations;
};