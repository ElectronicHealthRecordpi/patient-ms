import { HttpStatus, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BasePrismaService - Clase abstracta base para servicios que usan Prisma
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ¿Qué es esto?
 * ─────────────
 * Es una clase abstracta que extiende PrismaClient y centraliza lógica
 * repetida entre servicios: la conexión a la base de datos y la validación
 * de existencia de entidades relacionadas.
 *
 * ¿Qué prácticas teóricas aplica?
 * ────────────────────────────────
 *
 * 1. **DRY (Don't Repeat Yourself)**
 *    Antes, cada servicio repetía el patrón:
 *      const entity = await this.model.findUnique(...)
 *      if (!entity) throw new HttpException(...)
 *    Ahora esa lógica vive en UN solo lugar: `ensureExists()`.
 *    Si mañana cambia el formato del error, se cambia aquí y aplica a todos.
 *
 * 2. **Herencia y Abstracción (OOP - Programación Orientada a Objetos)**
 *    `abstract class` define un contrato parcial:
 *    - Implementa lo común (conexión + validación).
 *    - Deja que las clases hijas implementen su lógica de negocio.
 *    Esto es el principio de **Template Method** implícito: la clase base
 *    provee pasos reutilizables, las hijas los componen.
 *
 * 3. **Principio de Responsabilidad Única (SRP - SOLID)**
 *    La validación de existencia es una responsabilidad transversal.
 *    Al moverla a la clase base, cada servicio hijo solo se preocupa
 *    por su lógica CRUD específica.
 *
 * 4. **Principio Open/Closed (OCP - SOLID)**
 *    La clase está abierta a extensión (cualquier servicio puede heredarla
 *    y usar `ensureExists`) pero cerrada a modificación (no necesitas
 *    tocar esta clase para agregar nuevas validaciones en servicios hijos).
 *
 * ¿Cómo se usa?
 * ──────────────
 * En vez de:
 *   export class PatientService extends PrismaClient implements OnModuleInit { ... }
 *
 * Ahora:
 *   export class PatientService extends BasePrismaService { ... }
 *
 * Y dentro del servicio:
 *   await this.ensureExists(this.gender, genderId, 'genero');
 *   await this.ensureExists(this.bloodType, bloodTypeId, 'tipo de sangre');
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Interfaz mínima que debe cumplir un delegate de Prisma para
 * poder usar `ensureExists`. Solo necesita `findUnique`.
 *
 * Esto aplica **Programación orientada a interfaces / Duck Typing**:
 * no importa QUÉ modelo sea, solo que tenga `findUnique`.
 *
 * Se usa `any` en los args porque los delegates de Prisma tienen tipos
 * genéricos muy complejos que no son compatibles con interfaces simples.
 */
interface PrismaDelegate {
  findUnique(args: any): any;
  findMany(args?: any): any;
  findFirst(args?: any): any;
}

export abstract class BasePrismaService extends PrismaClient implements OnModuleInit {

  protected abstract readonly logger: Logger;

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado a la base de datos');
  }

  /**
   * Verifica que un registro exista en la base de datos.
   * Si no existe, lanza HttpException con BAD_REQUEST.
   *
   * @param delegate  - El modelo de Prisma (ej: this.gender, this.bloodType)
   * @param id        - El id a buscar
   * @param entityName - Nombre legible de la entidad (para el mensaje de error)
   *
   * @throws HttpException si el registro no existe
   *
   * Patrón aplicado: **Guard Clause**
   * En lugar de anidar if/else, se valida y se lanza excepción temprano.
   * Esto mantiene el flujo principal del método limpio y legible.
   */
  protected async ensureExists(
    delegate: PrismaDelegate,
    id: number | string,
    entityName: string,
  ): Promise<void> {
    const record = await delegate.findUnique({ where: { id } });
    if (!record) {
      throw new RpcException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `El id numero: ${id} del ${entityName} ingresado no existe`,
      });
    }
  }
  protected async hasRecords<T>(
    delegate: PrismaDelegate,
    entityName: string,
    options?: { isDeletedCheck?: boolean }
  ): Promise<{ message: string; data: T[] }> {

    const records = await delegate.findMany({
      where: options?.isDeletedCheck ? { isDeleted: false } : undefined,
    });

    if (records.length === 0) {
      return {
        message: `Aún no se registraron ${entityName}`,
        data: []
      };
    }

    return {
      message: `${entityName} obtenidos correctamente`,
      data: records
    };
  }
  protected async findByIdOrFail(
    delegate: PrismaDelegate,
    id: number | string,
    entityName: string): Promise<any> {
    const record = await delegate.findUnique({ where: { id } });
    if (!record) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró el ${entityName} con id: ${id}`,
      });
    }
    return record;
  }
  protected async valueExists<T>(
    delegate: PrismaDelegate,
    field: keyof T,
    value: any,
    entityName: string,
    excludeId?: number | string
  ): Promise<boolean> {
    const record = await delegate.findFirst({ where: { [field]: value, id: { not: excludeId } } });
    if (record)
      return true
    return false;
  }

}
