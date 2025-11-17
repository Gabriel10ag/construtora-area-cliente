import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // 🔐 Documentos do usuário logado
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myDocuments(@Req() req: any) {
    // JwtStrategy está populando req.user com { userId, email, name }
    const user = req.user as { userId: number; email: string; name: string };

    const docs = await this.documentsService.findByUserId(user.userId);

    return docs.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      fileUrl: d.fileUrl,
      fileType: d.fileType,
      // se quiser usar data depois, a gente ajusta a entity pra expor createdAt
      contractId: d.contract ? d.contract.id : null,
    }));
  }

  // 🔐 Upload de documento
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadDocument(
    @UploadedFile() file: any, // evita erro do namespace Express.Multer
    @Req() req: any,
  ) {
    const user = req.user as { userId: number; email: string; name: string };
    const { title, description, contractId } = req.body;

    const doc = await this.documentsService.createForUser({
      userId: user.userId,
      contractId: contractId ? Number(contractId) : null,
      title,
      description,
      fileUrl: `uploads/${file.filename}`,
      fileType: file.mimetype,
    });

    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      contractId: doc.contract ? doc.contract.id : null,
    };
  }

  // 🔐 Detalhe de um documento específico
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const doc = await this.documentsService.findById(Number(id));

    if (!doc) {
      return null;
    }

    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      contractId: doc.contract ? doc.contract.id : null,
    };
  }
}
