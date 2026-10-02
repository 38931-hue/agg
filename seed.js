import dotenv from 'dotenv';
import { connectDB } from './api/config/db.js';
import Celular from './api/models/Celular.js';

dotenv.config();

const celularesIniciais = [
  {
    marca: 'Samsung',
    modelo: 'Galaxy S25 Ultra',
    preco: 6999.9,
    foto: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
  },
  {
    marca: 'Apple',
    modelo: 'iPhone 16 Pro Max',
    preco: 9499.0,
    foto: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
  },
  {
    marca: 'Xiaomi',
    modelo: 'Xiaomi 14 Ultra',
    preco: 5299.9,
    foto: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
  },
  {
    marca: 'Motorola',
    modelo: 'Edge 50 Ultra',
    preco: 3899.0,
    foto: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
  },
];

async function seed() {
  try {
    console.log('🌱 Conectando ao banco de dados...');
    await connectDB();

    console.log('🧹 Limpando coleção de celulares...');
    await Celular.deleteMany({});

    console.log('📦 Inserindo celulares de demonstração...');
    const inseridos = await Celular.insertMany(celularesIniciais);

    console.log(`✅ ${inseridos.length} celulares cadastrados com sucesso!`);
    inseridos.forEach((c) => {
      console.log(`   - ${c.marca} ${c.modelo} (R$ ${c.preco.toFixed(2)})`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao popular banco:', err);
    process.exit(1);
  }
}

seed();
