export const woodworking_services = [
  {
    service_slug: 'custom-cabinet-making',
    service_name: 'Custom Cabinet Making',
    description:
      'Built-to-measure cabinetry for kitchens, pantry walls, and utility spaces with timber selection, hardware planning, soft-close fitting, and finish coordination included in the service scope.',
    rating: '4.9',
    price: '$1,850 starting rate',
    duration_of_service: '7 to 10 working days',
    sample_image: 'images/custom-cabinets.jpg',
    name_of_the_expert: 'Jakob Puri',
  },
  {
    service_slug: 'hardwood-stair-refinishing',
    service_name: 'Hardwood Stair Refinishing',
    description:
      'Surface repair and refinishing service for worn hardwood stairs, including sanding, stain correction, edge detailing, protective sealing, and tread-by-tread inspection before turnover.',
    rating: '4.8',
    price: '$980 package rate',
    duration_of_service: '3 to 5 working days',
    sample_image: 'images/refinish-wood-stairs.jpg',
    name_of_the_expert: 'Kenji Vizcayno',
  },
  {
    service_slug: 'built-in-storage-wall',
    service_name: 'Built-In Storage Wall',
    description:
      'Floor-to-ceiling storage carpentry for living rooms and bedrooms with concealed compartments, adjustable shelving, cable management, and site-fit installation for irregular wall conditions.',
    rating: '4.9',
    price: '$2,400 project estimate',
    duration_of_service: '10 to 14 working days',
    sample_image: 'images/built-in wall.jpg',
    name_of_the_expert: 'Riccel Lazatin',
  },
  {
    service_slug: 'dining-table-fabrication',
    service_name: 'Dining Table Fabrication',
    description:
      'Custom solid-wood dining table fabrication based on household size, preferred edge profile, base geometry, finish sheen, and everyday wear expectations for long-term use.',
    rating: '5.0',
    price: '$1,320 starting rate',
    duration_of_service: '6 to 8 working days',
    sample_image: 'images/dining-table.jpg',
    name_of_the_expert: 'Nash Cristobal',
  },
  {
    service_slug: 'retail-display-joinery',
    service_name: 'Retail Display Joinery',
    description:
      'Commercial-grade display joinery for boutiques and studio shops with modular shelving, brand-sensitive material pairing, reinforced framing, and installation sequencing for opening schedules.',
    rating: '4.7',
    price: '$2,950 commercial package',
    duration_of_service: '12 to 16 working days',
    sample_image: 'images/retail-joinery.webp',
    name_of_the_expert: 'Airel Evangelista',
  },
  {
    service_slug: 'heritage-furniture-restoration',
    service_name: 'Heritage Furniture Restoration',
    description:
      'Careful restoration for heirloom cabinets, desks, and accent pieces with veneer repair, joint stabilization, finish revival, and non-invasive techniques for preserving original character.',
    rating: '4.9',
    price: '$760 assessment-based rate',
    duration_of_service: '4 to 7 working days',
    sample_image: 'images/furniture-restoration.jpg',
    name_of_the_expert: 'Vince Obejas',
  },
];

export const getWoodworkingServiceBySlug = (service_slug) => {
  return woodworking_services.find((service) => service.service_slug === service_slug);
};